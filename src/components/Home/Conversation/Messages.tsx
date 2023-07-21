import { styled } from "styled-components";
import Message from "./Message";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useWindowSize } from "../../../core/hooks/useWindowSize";
import { WIDTH } from "../../../pages/HomePage";

const MessagesWrapper = styled.div`
  flex: 1;
  background-color: #ddddf7;
  padding: 10px;
  height: calc(100% - 199px);
  overflow-y: overlay;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* &.hidden-scroll::-webkit-scrollbar {
    width: 0px;
  } */

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

export interface MessageType {
  date: Timestamp;
  id: string;
  textMessage: string;
  photoMessage?: string;
  senderId: string;
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

const Messages = () => {
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const { data } = useContext(ChatContext);
  const { width } = useWindowSize();

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

  return (
    <MessagesWrapper className={width <= WIDTH ? "hidden-scroll" : ""}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </MessagesWrapper>
  );
};

export default Messages;
