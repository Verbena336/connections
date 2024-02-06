export interface PeopleResponse {
  Count: number;
  Items: ItemPeopleResponse[];
}

export interface ItemPeople {
  uid: string;
  name: string;
}

export interface ItemPeopleResponse {
  uid: {
    S: string;
  };
  name: {
    S: string;
  };
}
