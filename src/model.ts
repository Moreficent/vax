export interface State {
  state_id: number;
  state_name: string;
}

export interface District {
  district_id: number;
  district_name: string;
}

export class StateAndDistrict {
  readonly name: string;
  readonly districts: Array<District>;

  constructor(name: string, districts: Array<District>) {
    this.name = name;
    this.districts = districts;
  }
}
