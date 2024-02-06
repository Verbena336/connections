export interface ConversationResponse {
  Count: number;
  Items: ItemConversationResponse[];
}

export interface ItemConversationResponse {
  authorID: {
    S: string;
  };
  message: {
    S: string;
  };
  createdAt: {
    S: string;
  };
}

export interface CreateConversationResponse {
  conversationID: 'string';
}

export interface ConversationListResponse {
  Count: number;
  Items: ItemListConversationResponse[];
}

export interface ItemListConversationResponse {
  id: {
    S: 'string';
  };
  companionID: {
    S: 'string';
  };
}

export interface ItemListConversation {
  id: string;
  companionID: string;
}
