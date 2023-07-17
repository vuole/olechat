import styled from "styled-components";
import { ChatContext, LastMessageType } from "../../../contexts/ChatContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

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
  lastMessage?: LastMessageType;
  onClick(): Promise<void> | void;
}

const Chat = ({
  hasLastMessage = true,
  chatId = "",
  photoURL,
  displayName,
  lastMessage,
  onClick,
}: ChatProps) => {
  const { data } = useContext(ChatContext);
  const textMessage = data.messages[chatId]?.textMessage;
  const photoMessage = data.messages[chatId]?.photoMessage;

  return (
    <UserChat
      onClick={() => {
        onClick();
      }}
      className={data.chatId == chatId ? "selected" : ""}
    >
      <img src={photoURL} alt="avatar" />
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
      {!lastMessage?.isSeen && (
        <FontAwesomeIcon
          icon={faCircle}
          size="xs"
          style={{ color: "#2e88ff" }}
        />
      )}
    </UserChat>
  );
};

export default Chat;
