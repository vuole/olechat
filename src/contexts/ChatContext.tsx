import { createContext, useReducer } from "react";
import { UserInfo } from "../containers/HomeSidebarContainer";

export const ChatContext = createContext<ChatContextType>({} as ChatContextType);

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
    case "CHANGE_USER":
      return {
        user: action.payload[1].userInfo,
        chatId: action.payload[0],
      };

    case "DELETE_USER":
      return INITIAL_STATE;

    default:
      return state;
  }
};

const INITIAL_STATE: ChatUser = {
  chatId: "",
  user: {} as UserInfo,
};

interface ChatUser {
  chatId: string;
  user: UserInfo;
}

interface ChatContextType {
  data: ChatUser,
  dispatch: React.Dispatch<any>
}
