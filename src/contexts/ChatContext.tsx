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
        chatId: action.payload[0],
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
  messages: {},
};

interface ChatUser {
  chatId: string;
  user: UserInfo;
  messages: {
    [field: string]: { textMessage: string; photoMessage: File | null };
  };
}

interface ChatContextType {
  data: ChatUser;
  dispatch: React.Dispatch<any>;
}
