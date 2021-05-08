import {OrderedMap} from 'immutable';
import moment from 'moment';

import {State, StateAndDistrict, Center, FlatSession} from './model';

const BASE_URL = 'https://cdn-api.co-vin.in/api';
const STATES_URL = `${BASE_URL}/v2/admin/location/states`;
const DISTRICTS_BASE_URL = `${BASE_URL}/v2/admin/location/districts`;
const SLOTS_BASE_URL = `${BASE_URL}/v2/appointment/sessions/public/calendarByDistrict`;

export class FetchLocationsReply {
  readonly success: boolean;

  readonly failureRep: string;

  readonly locs: OrderedMap<number, StateAndDistrict>;

  private constructor(success: boolean, failureRep: string, locs: OrderedMap<number, StateAndDistrict>) {
    this.success = success;
    this.failureRep = failureRep;
    this.locs = locs;
  }

  static STATES_FETCH_FAILURE: FetchLocationsReply = new FetchLocationsReply(
    false,
    'Failed to fetch states',
    OrderedMap(),
  );

  static DISTRICT_FETCH_FAILURE: FetchLocationsReply = new FetchLocationsReply(
    false,
    'Failed to fetch districts',
    OrderedMap(),
  );

  static success(locs: OrderedMap<number, StateAndDistrict>): FetchLocationsReply {
    return new FetchLocationsReply(true, '', locs);
  }
}

export async function fetchLocations(): Promise<FetchLocationsReply> {
  let statesArray: Array<State>;

  try {
    statesArray = await fetch(STATES_URL)
      .then((response) => response.json())
      .then((response) => {
        const {states} = response;
        if (states) {
          return states as Array<State>;
        }
        return Promise.reject('states field is not present in reply');
      });
  } catch (err) {
    console.error(err);
    return FetchLocationsReply.STATES_FETCH_FAILURE;
  }

  const stateDistrictPromise = statesArray.map((state) =>
    fetch(`${DISTRICTS_BASE_URL}/${state.state_id}`)
      .then((response) => response.json())
      .then((response) => {
        const {districts} = response;
        if (districts) {
          const res: [number, StateAndDistrict] = [state.state_id, new StateAndDistrict(state.state_name, districts)];
          return res;
        }
        return Promise.reject('districts field is not present in reply');
      }),
  );

  let locsArray: Array<[number, StateAndDistrict]>;

  try {
    locsArray = await Promise.all(stateDistrictPromise);
  } catch (err) {
    console.error(err);
    return FetchLocationsReply.DISTRICT_FETCH_FAILURE;
  }

  const locs: OrderedMap<number, StateAndDistrict> = OrderedMap(locsArray);

  return FetchLocationsReply.success(locs);
}

export async function fetchSessions(districtIds: Array<number>): Promise<Array<FlatSession>> {
  const dateRep = moment().format('DD-MM-YYYY');
  const promises = districtIds.map((id) => {
    const queryURL = `${SLOTS_BASE_URL}?district_id=${id}&date=${dateRep}`;

    return fetch(queryURL)
      .then((resp) => resp.json())
      .then((resp) => {
        const {centers} = resp;
        if (centers) {
          return centers as Array<Center>;
        }
        return Promise.reject('centers field not present in reply');
      })
      .then((centers) => {
        const res: Array<FlatSession> = [];
        centers.forEach((center) => {
          center.sessions.forEach((session) => {
            if (session.available_capacity > 0 && session.min_age_limit === 18) {
              res.push(
                new FlatSession(
                  session.session_id,
                  session.date,
                  session.available_capacity,
                  center.name,
                  center.address,
                  center.state_name,
                  center.district_name,
                ),
              );
            }
          });
        });
        return res;
      });
  });

  let res: Array<FlatSession> = [];

  try {
    const responses = await Promise.allSettled(promises);
    responses.forEach((response) => {
      if (response.status === 'rejected') {
        console.error(response.reason);
      } else {
        const {value} = response;
        res = res.concat(value);
      }
    });
  } catch (err) {
    console.error(err);
  }

  res.sort((a, b) => b.capacity - a.capacity);

  return res;
}
