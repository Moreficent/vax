import {State, StateAndDistrict} from './model';

const BASE_URL = 'https://cdn-api.co-vin.in/api';
const STATES_URL = `${BASE_URL}/v2/admin/location/states`;
const DISTRICTS_BASE_URL = `${BASE_URL}/v2/admin/location/districts`;

export class FetchLocationsReply {
  readonly success: boolean;

  readonly failureRep: string | undefined;

  readonly locs: Array<StateAndDistrict>;

  private constructor(success: boolean, failureRep: string | undefined, locs: Array<StateAndDistrict>) {
    this.success = success;
    this.failureRep = failureRep;
    this.locs = locs;
  }

  static STATES_FETCH_FAILURE: FetchLocationsReply = new FetchLocationsReply(false, 'Failed to fetch states', []);

  static DISTRICT_FETCH_FAILURE: FetchLocationsReply = new FetchLocationsReply(false, 'Failed to fetch districts', []);

  static success(locs: Array<StateAndDistrict>): FetchLocationsReply {
    return new FetchLocationsReply(true, undefined, locs);
  }
}

export async function fetch_locations(): Promise<FetchLocationsReply> {
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
          return new StateAndDistrict(state.state_id, state.state_name, districts);
        }
        return Promise.reject('districts field is not present in reply');
      }),
  );

  let locs: Array<StateAndDistrict>;

  try {
    locs = await Promise.all(stateDistrictPromise);
  } catch (err) {
    console.error(err);
    return FetchLocationsReply.DISTRICT_FETCH_FAILURE;
  }

  return FetchLocationsReply.success(locs);
}

async function fetch_slots() {
  console.log('ho gaya');
}

export default fetch_slots;
