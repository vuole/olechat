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

const Conversation = ({ hasLatestMessage, photoURL, displayName, lastMessage, onClick }: any) => {
  return (
    <UserChat
      onClick={() => {
        onClick();
      }}
    >
      <img src={photoURL} alt="avatar" />
      <UserChatInfo>
        <span>{displayName}</span>
        {hasLatestMessage && <p>{lastMessage}</p>}
      </UserChatInfo>
    </UserChat>
  );
};

export default Conversation;
