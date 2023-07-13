import styled from "styled-components";
import { ChatContext } from "../../../contexts/ChatContext";
import { useContext } from "react";

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
  span {
    font-size: 18px;
    font-weight: 500;
  }
  p {
    font-size: 14px;
    color: lightgray;
  }
`;

interface ChatProps {
  hasLastMessage?: boolean;
  chatId?: string;
  photoURL: string;
  displayName: string;
  lastMessage?: string;
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
          <p>
            {(textMessage || photoMessage) &&
            data.chatId != chatId
              ? photoMessage
                ? `a photo [unsent]`
                : `${textMessage} [unsent]`
              : lastMessage}
          </p>
        )}
      </UserChatInfo>
    </UserChat>
  );
};

export default Chat;
