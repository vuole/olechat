import styled from "styled-components";
import { ChatContext, LastMessageType } from "../../../contexts/ChatContext";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OnlineStatusType } from "../Conversation/Header";
import { faCircle as solidFaCircle } from "@fortawesome/free-solid-svg-icons";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { ConversationContext } from "../../../contexts/ConversationContext";

const UserChat = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
  &.selected {
    background-color: #2f2d52;
  }
  &:hover {
    background-color: #2f2d52;
  }
  .avatar-user-chats {
    width: 50px;
    height: 50px;
    position: relative;
    .online-status-icon {
      position: absolute;
      right: 5px;
      bottom: 0;
    }
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserChatInfo = styled.div`
  flex-grow: 1;
  span {
    font-size: 18px;
    font-weight: 500;
  }
  p {
    font-size: 14px;
    color: lightgray;
    &.unseen {
      font-weight: bold;
    }
  }
`;

interface ChatProps {
  hasLastMessage?: boolean;
  chatId?: string;
  photoURL: string;
  displayName: string;
  userChatId: string;
  lastMessage?: LastMessageType;
  onClick(): Promise<void> | void;
}

const Chat = ({
  hasLastMessage = true,
  chatId = "",
  photoURL,
  displayName,
  userChatId,
  lastMessage,
  onClick,
}: ChatProps) => {
  const { data } = useContext(ChatContext);
  const textMessage = data.messages[chatId]?.textMessage;
  const photoMessage = data.messages[chatId]?.photoMessage;
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatusType>(
    {} as OnlineStatusType
  );
  const { conversation, conversationDispatch } = useContext(ConversationContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "onlineStatus", userChatId), (doc) => {
      setOnlineStatus((doc.data() || {}) as OnlineStatusType);
    });
    return () => {
      unsub();
    };
  }, [data, userChatId]);

  useEffect(() => {
    if (data.user.uid === userChatId) {
      conversationDispatch({
        type: "UPDATE_ONLINE_STATUS",
        payload: onlineStatus,
      });
    }
  }, [onlineStatus, conversation.onlineStatus]);

  return (
    <UserChat
      onClick={() => {
        onClick();
      }}
      className={data.chatId == chatId ? "selected" : ""}
    >
      <span className="avatar-user-chats">
        <img src={photoURL} alt="avatar" />
        <FontAwesomeIcon
          icon={solidFaCircle}
          size="xs"
          style={{
            color: onlineStatus.state === "online" ? "#00ff00" : "#c0c0c0",
            width: "10px",
            height: "10px",
          }}
          className="online-status-icon"
        />
      </span>
      <UserChatInfo>
        <span>{displayName}</span>
        {hasLastMessage && (
          <p className={!lastMessage?.isSeen ? "unseen" : ""}>
            {(textMessage || photoMessage) && data.chatId != chatId
              ? photoMessage
                ? `a photo [unsent]`
                : `${textMessage} [unsent]`
              : lastMessage?.lastMessage}
          </p>
        )}
      </UserChatInfo>
      {!lastMessage?.isSeen && hasLastMessage && (
        <FontAwesomeIcon
          icon={solidFaCircle}
          size="xs"
          style={{ color: "#2e88ff" }}
        />
      )}
    </UserChat>
  );
};

export default Chat;
