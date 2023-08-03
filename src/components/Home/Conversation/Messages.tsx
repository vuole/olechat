import { css, styled } from "styled-components";
import Message from "./Message";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../contexts/AuthContext";

const MessagesWrapper = styled.div`
  flex: 1;
  background-color: #ddddf7;
  padding: 10px;
  height: calc(100% - 199px);
  overflow-y: overlay;
  overflow-x: hidden;
  //scrollbar css
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #5d5b8d;
    /* border: 2px pink solid; */
    background-clip: padding-box;
    border-radius: 9999px;
  }

  &::-webkit-scrollbar-track {
    background: #ffffff;
  }
`;

const MessageWrapper = styled.div<{
  $isFriendMessage: boolean;
  $isMyOwnMessage: boolean;
  $hasDisplayMessageTime: boolean;
}>`
  @keyframes fadeBackground {
    from {
      background-color: pink;
    }
    to {
      background-color: #ddddf7;
    }
  }
  
  &.animation {
    animation: fadeBackground 3s;
  }

  display: flex;
  flex-direction: ${(props) => (props.$isMyOwnMessage ? "row-reverse" : "row")};
  margin-bottom: ${(props) => (props.$hasDisplayMessageTime ? "8px" : "4px")};

  &:hover .reply-icon {
    display: inline;
  }
  
  ${(props) =>
    props.$isFriendMessage &&
    css`
      gap: 8px;
      div:nth-child(2) {
        margin-left: 0;
        flex-grow: 1;
      }
      .friend-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }
    `}
`;

export interface MessageType {
  date: Timestamp;
  id: string;
  textMessage: string;
  photoMessage?: string;
  senderId: string;
  repliedMessage?: MessageType;
}

export function playSound() {
  const audio = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/olechat-f8ab7.appspot.com/o/c9adaa31-6c29-4e6f-8a76-d79d8cd0892e?alt=media&token=3a818b56-4422-4cee-b46f-8723407645e9"
  );
  const play = audio.play();
  if (play !== undefined) {
    play
      .then((_) => {
        audio.play();
      })
      .catch((error) => {
        console.log("error audio");
        audio.pause();
      });
  }
}

let d: number = 0;
const Messages = () => {
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const { data } = useContext(ChatContext);
  const messagesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const currenUser = useContext(AuthContext);

  useEffect(() => {
    //lắng nghe thay đổi của conversation đang chọn và lấy về dữ liệu mới
    const unSub = onSnapshot(doc(db, "conversations", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
      //khi chuyển qua lại giữa các chat thì không hiển thị tin nhắn của conversation trước đó
      //trong lúc chờ fetch conversation mới
      setMessages([]);
    };
  }, [data.chatId]);

  const handleAddNode = (
    messageId: string,
    messageWrappperRef: HTMLDivElement
  ) => {
    if (messageWrappperRef) {
      // Thêm vào map
      messagesRef.current.set(messageId, messageWrappperRef);
    } else {
      // Xóa khỏi map
      messagesRef.current.delete(messageId);
    }
  };

  function scrollToId(repliedMessageId: string) {
    const node = messagesRef.current?.get(repliedMessageId);
    node?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    node?.classList.add("animation");
    //Xóa class animation ứng với node này sau khi animation css trước đó đã chạy xong(trong css)
    //để có thể kích hoạt lại animation css của node này trong lần click tiếp theo
    setTimeout(() => node?.classList.remove("animation"), 3000);
  }

  return (
    <MessagesWrapper>
      {messages.map((m, i) => {
        const isMyOwnMessage = m.senderId === currenUser?.uid;
        if (isMyOwnMessage) {
          d = 0;
        }
        //Mỗi khi bạn chat nhắn nhiều tin nhắn liên tiếp, phát hiện ra tin nhắn đầu tiên để chỉ hiển thị Avatar ở đầu
        const isFriendMessage = m.senderId !== currenUser?.uid && d === 0;
        //Mỗi chuỗi tin nhắn liên tiếp của cả 2 người chat, phát hiện ra tin nhắn cuối cùng của mỗi người để chỉ hiển thị Time ở cuối
        const hasDisplayMessageTime = m.senderId !== messages[i + 1]?.senderId;
        return (
          <MessageWrapper
            key={m.id}
            $isFriendMessage={isFriendMessage}
            $isMyOwnMessage={isMyOwnMessage}
            $hasDisplayMessageTime={hasDisplayMessageTime}
            ref={(node: HTMLDivElement) => {
              handleAddNode(m.id, node);
            }}
          >
            {isFriendMessage && (
              <img
                className="friend-avatar"
                src={data.user.photoURL}
                alt={d++ + ""}
              />
            )}
            <Message
              message={m}
              scrollToId={scrollToId}
              hasDisplayMessageTime={hasDisplayMessageTime}
            />
          </MessageWrapper>
        );
      })}
    </MessagesWrapper>
  );
};

export default Messages;
