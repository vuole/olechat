import { styled } from "styled-components";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useEffect, useMemo, useRef } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { MessageType } from "./Messages";
import Moment from "react-moment";

const MessageWrappper = styled.div`
  display: flex;
  gap: 5px;
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
  font-size: 12px;
  width: 71px;

  &.owner {
    align-items: flex-end;
  }

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

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const currenUser = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef<HTMLDivElement>(null);

  const isCurrentUserChat = useMemo(() => {
    return message.senderId == currenUser?.uid;
  }, [message, currenUser]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <MessageWrappper ref={ref} className={isCurrentUserChat ? "owner" : ""}>
      <MessageInfo className={isCurrentUserChat ? "owner" : ""}>
        <img
          src={
            isCurrentUserChat ? currenUser?.photoURL || "" : data.user.photoURL
          }
          alt="avatar"
        />
        <Moment fromNow ago interval={60000}>
          {message.date.seconds * 1000}
        </Moment>
      </MessageInfo>
      <MessageContent className={isCurrentUserChat ? "owner" : ""}>
        {message.textMessage && <p>{message.textMessage}</p>}
        {message.photoMessage && (
          <img src={message.photoMessage} alt="message photo" />
        )}
      </MessageContent>
    </MessageWrappper>
  );
};

export default Message;
