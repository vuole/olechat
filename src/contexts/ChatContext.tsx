import { createContext, useReducer } from "react";

export const ChatContext = createContext<any>({});

export const ChatProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

const chatReducer = (state: any, action: any) => {
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

const INITIAL_STATE = {
  chatId: "",
  user: {},
};
