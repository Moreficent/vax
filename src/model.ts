export interface State {
  state_id: number;
  state_name: string;
}

export interface District {
  district_id: number;
  district_name: string;
}

export interface Session {
  session_id: string;
  date: string;
  available_capacity: number;
  min_age_limit: number;
}

export interface Center {
  name: string;
  address: string;
  state_name: string;
  district_name: string;
  sessions: Array<Session>;
}

export class StateAndDistrict {
  readonly name: string;
  readonly districts: Array<District>;

  constructor(name: string, districts: Array<District>) {
    this.name = name;
    this.districts = districts;
  }
}

export class FlatSession {
  id: string;
  date: string;
  capacity: number;
  centerName: string;
  centerAddress: string;
  centerState: string;
  centerDistrict: string;

  constructor(
    id: string,
    date: string,
    capacity: number,
    centerName: string,
    centerAddress: string,
    centerState: string,
    centerDistrict: string,
  ) {
    this.id = id;
    this.date = date;
    this.capacity = capacity;
    this.centerName = centerName;
    this.centerAddress = centerAddress;
    this.centerState = centerState;
    this.centerDistrict = centerDistrict;
  }
}
