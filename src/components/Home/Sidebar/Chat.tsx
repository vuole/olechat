import styled from "styled-components";

const UserChat = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
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

interface ChatProps{
  hasLastMessage?: boolean;
  photoURL: string;
  displayName: string;
  lastMessage?: string;
  onClick(): Promise<void> | void;
}

const Chat = ({ hasLastMessage = true, photoURL, displayName, lastMessage, onClick }: ChatProps) => {
  return (
    <UserChat
      onClick={() => {
        onClick();
      }}
    >
      <img src={photoURL} alt="avatar" />
      <UserChatInfo>
        <span>{displayName}</span>
        {hasLastMessage && <p>{lastMessage}</p>}
      </UserChatInfo>
    </UserChat>
  );
};

export default Chat;
