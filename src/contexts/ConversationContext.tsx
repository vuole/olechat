import { createContext, useReducer } from "react";

export const ConversationContext = createContext<any>({});

export const ConversationProvider = ({ children }: any) => {
  const [state, conversationDispatch] = useReducer(
    conversationReducer,
    INITIAL_STATE
  );
  return (
    <ConversationContext.Provider
      value={{ conversation: state, conversationDispatch }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

const conversationReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGED_FOCUS_FOCUS":
      return {
        ...state,
        isFocusMessageInput: action.payload,
      };
    case "UPDATE_ONLINE_STATUS":
      return {
        ...state,
        onlineStatus: action.payload,
      };
    case "UPDATE_IS_FOREGROUND":
      return {
        ...state,
        isForeground: action.payload,
      };

    default:
      return state;
  }
};

const INITIAL_STATE = {
  isFocusMessageInput: false,
  isForeground: true,
  onlineStatus: {},
};
