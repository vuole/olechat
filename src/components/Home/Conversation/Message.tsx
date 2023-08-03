import { css, styled } from "styled-components";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { MessageType } from "./Messages";
import Moment from "react-moment";
import ModalImage from "react-modal-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { ConversationContext } from "../../../contexts/ConversationContext";

const MessageContent = styled.div<{ $isMyOwnMessage: boolean }>`
  max-width: 80%;
  margin-left: 48px;

  p {
    background-color: white;
    color: black;
    padding: 10px;
    border-radius: 10px;
    max-width: max-content;
    min-width: 60px;

    ${(props) =>
      props.$isMyOwnMessage &&
      css`
        background-color: #8da4f1;
        color: white;
      `}
  }

  .small-photo-message {
    width: 250px;
    border-radius: 10px;
  }

  .reply-icon {
    display: none;
    color: #4a4a4e;
    cursor: pointer;
  }

  .flex-center-icon {
    display: flex;
    flex-direction: ${(props) =>
      props.$isMyOwnMessage ? "row-reverse" : "row"};
    align-items: center;
    gap: 10px;
  }
`;

const RepliedMessage = styled.div<{ $isMyOwnMessage: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.$isMyOwnMessage ? "flex-end" : "flex-start"};
  cursor: pointer;

  p {
    background-color: #b6c5f5;
    color: grey;
    margin-right: 10px;
    font-size: 13px;
    span {
      color: black;
      font-weight: 500;
    }
  }

  img {
    width: 20%;
    border-radius: 10px;
    margin-right: 10px;
    opacity: 0.6;
  }
`;

const TextMessageWrapper = styled.div`
  p {
    width: 100%;
    flex-shrink: 0;
  }
`;

const PhotoMessageWrapper = styled.div`
  width: 100%;
`;

const MainContent = styled.div<{
  $isMyOwnMessage: boolean;
  $isReplyMessage: boolean;
  $isPhotoAndTextMessage: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) =>
    props.$isMyOwnMessage ? "flex-end" : "flex-start"};
  gap: 0px;

  ${(props) =>
    props.$isPhotoAndTextMessage &&
    css`
      p {
        border-radius: 10px 10px 0 0;
      }
      .small-photo-message {
        border-radius: 0 0 10px 10px;
      }
    `}

  ${(props) =>
    props.$isReplyMessage &&
    css`
      margin-top: -8px;
    `}

  .text-message-time {
    display: block;
    font-size: 10px;
    color: grey;
  }

  .common-message-time {
    color: white;
    background-color: grey;
    padding: 0 2px;
    border-radius: 8px;
  }
`;

interface MessageProps {
  message: MessageType;
  scrollToId(repliedMessageId: string): void; //scroll đến tin nhắn được chọn để trả lời
  hasDisplayMessageTime: boolean; //khi mới mở conversation tin nhắn có được hiển thị time hay không
}

const calendarStrings = {
  lastDay: "HH:mm [Yesterday]",
  sameDay: "HH:mm",
  nextDay: "[Tomorrow at] HH:mm",
  lastWeek: "HH:mm [last] dddd",
  nextWeek: "dddd [at] HH:mm",
  sameElse: "HH:mm L",
};

const Message = ({
  message,
  scrollToId,
  hasDisplayMessageTime,
}: MessageProps) => {
  const currenUser = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const { conversationDispatch } = useContext(ConversationContext);
  const messageContentRef = useRef<HTMLDivElement>(null);
  const [messageIsClicked, setMessageIsClicked] = useState(false);

  const isMyOwnMessage = useMemo(() => {
    return message.senderId === currenUser?.uid;
  }, [message, currenUser]);

  useEffect(() => {
    messageContentRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
    return () => {};
  }, []);

  const ReplyIcon = (props: { style?: React.CSSProperties | undefined }) => (
    <FontAwesomeIcon
      className="reply-icon"
      icon={faReply}
      size="xs"
      onClick={() => {
        dispatch({
          type: "EDITED_MESSAGE",
          payload: { repliedMessage: message },
        });
        conversationDispatch({
          type: "CHANGED_FOCUS_FOCUS",
          payload: true,
        });
      }}
      {...props}
    />
  );

  return (
    <MessageContent ref={messageContentRef} $isMyOwnMessage={isMyOwnMessage}>
      {/* Nội dung tin nhắn được chọn để trả lời */}
      {message.repliedMessage && (
        <RepliedMessage $isMyOwnMessage={isMyOwnMessage}>
          {message.repliedMessage?.textMessage &&
            !message.repliedMessage?.photoMessage && (
              <p
                onClick={() => {
                  scrollToId(message.repliedMessage?.id || "");
                }}
              >
                <span>
                  {message.repliedMessage?.senderId === currenUser?.uid
                    ? currenUser?.displayName
                    : data.user.displayName}
                </span>{" "}
                <br />
                {message.repliedMessage?.textMessage}
              </p>
            )}
          {message.repliedMessage?.photoMessage && (
            <img
              src={message.repliedMessage?.photoMessage}
              alt=""
              onClick={() => {
                scrollToId(message.repliedMessage?.id || "");
              }}
            />
          )}
        </RepliedMessage>
      )}

      {/* Nội dung chính của tin nhắn */}
      <MainContent
        $isMyOwnMessage={isMyOwnMessage}
        $isReplyMessage={message.repliedMessage ? true : false}
        $isPhotoAndTextMessage={
          message.photoMessage && message.textMessage ? true : false
        }
        onClick={() => setMessageIsClicked(!messageIsClicked)}
      >
        {message.textMessage && (
          <TextMessageWrapper className="flex-center-icon">
            <p>
              {message.textMessage}
              {(hasDisplayMessageTime || messageIsClicked) &&
                !message.photoMessage && (
                  <Moment
                    className="text-message-time"
                    calendar={calendarStrings}
                  >
                    {message.date.seconds * 1000}
                  </Moment>
                )}
            </p>
            <ReplyIcon
              style={message.photoMessage ? { display: "none" } : undefined}
            />
          </TextMessageWrapper>
        )}
        {message.photoMessage && (
          <PhotoMessageWrapper className="flex-center-icon">
            <ModalImage
              className="small-photo-message"
              small={message.photoMessage}
              large={message.photoMessage}
              hideDownload={true}
              showRotate={true}
              alt="Ole Chat"
            />
            <ReplyIcon />
          </PhotoMessageWrapper>
        )}
        {(hasDisplayMessageTime || messageIsClicked) &&
          message.photoMessage && (
            <Moment
              className="text-message-time common-message-time"
              calendar={calendarStrings}
            >
              {message.date.seconds * 1000}
            </Moment>
          )}
      </MainContent>
    </MessageContent>
  );
};

export default Message;
