export interface State {
  state_id: number;
  state_name: string;
}

export interface District {
  district_id: number;
  district_name: string;
}

export class StateAndDistrict {
  readonly id: number;
  readonly name: string;
  readonly districts: Array<District>;

  constructor(id: number, name: string, districts: Array<District>) {
    this.id = id;
    this.name = name;
    this.districts = districts;
  }
}
