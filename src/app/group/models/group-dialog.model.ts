export interface GroupDialogResponse {
  Count: number;
  Items: ItemGroupDialogResponse[];
}

export interface ItemGroupDialogResponse {
  authorID: {
    S: 'string';
  };
  message: {
    S: 'string';
  };
  createdAt: {
    S: 'string';
  };
}

export interface GroupResponse {
  Count: number;
  Items: ItemGroupResponse[];
}

export interface ItemGroup {
  id: string;
  name: string;
  createdAt?: string;
  createdBy: string;
}

export interface ItemGroupResponse {
  id: {
    S: string;
  };
  name: {
    S: string;
  };
  createdAt: {
    S: string;
  };
  createdBy: {
    S: string;
  };
}

export interface CreateGroupResponse {
  groupID: string;
}
