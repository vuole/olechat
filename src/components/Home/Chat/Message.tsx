import { styled } from "styled-components";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";
import { ChatContext } from "../../../contexts/ChatContext";

const MessageWrappper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  &.owner {
    flex-direction: row-reverse;
  }
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: gray;
  font-weight: 300;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const MessageContent = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    background-color: white;
    padding: 10px 20px;
    border-radius: 0px 10px 10px 10px;
    max-width: max-content;
  }

  &.owner {
    align-items: flex-end;
    p {
      background-color: #8da4f1;
      color: white;
      border-radius: 10px 0px 10px 10px;
    }
  }

  img {
    width: 50%;
  }
`;

const Message = ({ message }: any) => {
  const currenUser = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const isCurrentUserChat = message.senderId == currenUser?.uid;
  return (
    <MessageWrappper className={isCurrentUserChat ? "owner" : ""}>
      <MessageInfo>
        <img
          src={isCurrentUserChat ? currenUser?.photoURL : data.user.photoURL}
          alt="avatar"
        />
        <span>just now</span>
      </MessageInfo>
      <MessageContent className={isCurrentUserChat ? "owner" : ""}>
        {message.messageText && <p>{message.messageText}</p>}
        {message.messagePhoto && <img
          src={message.messagePhoto}
          alt="message photo"
        />}
      </MessageContent>
    </MessageWrappper>
  );
};

export default Message;
