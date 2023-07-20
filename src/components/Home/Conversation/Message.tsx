import { styled } from "styled-components";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useEffect, useMemo, useRef } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { MessageType } from "./Messages";
import Moment from "react-moment";
import ModalImage from "react-modal-image";

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

  //Thẻ div này bọc thẻ img (là ảnh nhỏ có class.small-photo-message) trong ModalImage
  div {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .small-photo-message {
    width: 50%;
  }
`;

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const currenUser = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const messageWrappperRef = useRef<HTMLDivElement>(null);

  const isCurrentUserChat = useMemo(() => {
    return message.senderId == currenUser?.uid;
  }, [message, currenUser]);

  useEffect(() => {
    messageWrappperRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [message]);

  return (
    <MessageWrappper ref={messageWrappperRef} className={isCurrentUserChat ? "owner" : ""}>
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
          <ModalImage
            className="small-photo-message"
            small={message.photoMessage}
            large={message.photoMessage}
            hideDownload={true}
            showRotate={true}
            alt="Ole Chat"
          />
        )}
      </MessageContent>
    </MessageWrappper>
  );
};

export default Message;
