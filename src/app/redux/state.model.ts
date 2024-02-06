export interface State {
  userProfile: UserProfile;
  groupsMessages: GroupsMessages;
  conversationsMessages: ConversationsMessages;
}

export interface GroupsMessages {
  messagesData: MessagesData;
  isLoading: boolean;
  isError: IError | null;
  since: Since;
}

export interface Since {
  [id: string]: string;
}

export interface ConversationsMessages {
  messagesData: MessagesData;
  isLoading: boolean;
  isError: IError | null;
  since: Since;
}

export interface UserProfile {
  userData: UserData;
  isLoading: boolean;
  isError: IError | null;
}

export interface UserData {
  uid: string;
  email: string;
  createdAt: string;
  name: string;
}

export interface IError {
  type?: string;
  message: string;
}

export interface MessagesData {
  [id: string]: ItemMessage[];
}

export interface ItemMessage {
  authorID: string;
  message: string;
  createdAt: string;
}
