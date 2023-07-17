import { createContext, useReducer } from "react";
import { UserInfo } from "../containers/HomeSidebarContainer";

export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

export const ChatProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

const chatReducer = (state: ChatUser, action: any) => {
  switch (action.type) {
    case "CHANGED_USER":
      return {
        ...state,
        user: action.payload[1].userInfo,
        lastMessage: action.payload[1].lastMessage,
        chatId: action.payload[0],
      };

    case "IS_SEEN":
      return {
        ...state,
        lastMessage: { ...state.lastMessage, isSeen: true },
      };

    case "DELETED_USER":
      return INITIAL_STATE;

    case "EDITED_MESSAGE":
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.chatId]: action.payload,
        },
      };

    case "SENT_MESSAGE":
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.chatId]: { textMessage: "", photoMessage: null },
        },
      };

    default:
      return state;
  }
};

const INITIAL_STATE: ChatUser = {
  chatId: "",
  user: {} as UserInfo,
  lastMessage: {} as LastMessageType,
  messages: {},
};

interface ChatUser {
  chatId: string;
  user: UserInfo;
  lastMessage: LastMessageType;
  messages: {
    [field: string]: { textMessage: string; photoMessage: File | null };
  };
}

export interface LastMessageType {
  lastMessage: string;
  senderId: string;
  isSeen: boolean;
  id: string;
}

interface ChatContextType {
  data: ChatUser;
  dispatch: React.Dispatch<any>;
}
