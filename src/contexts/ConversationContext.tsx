import { createContext, useReducer } from "react";
import { UserInfo } from "../containers/HomeSidebarContainer";

export const ConversationContext = createContext<any>(
  {}
);

export const ConversationProvider = ({ children }: any) => {
  const [state, conversationDispatch] = useReducer(conversationReducer, INITIAL_STATE);
  return (
    <ConversationContext.Provider value={{ conversation: state, conversationDispatch }}>
      {children}
    </ConversationContext.Provider>
  );
};

const conversationReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGED_FOCUS_FOCUS":
      return {
        isFocusMessageInput: action.payload
      };

    default:
      return state;
  }
};

const INITIAL_STATE = {
  isFocusMessageInput: false,
};
