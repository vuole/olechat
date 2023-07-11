import { styled } from "styled-components";
import Message from "./Message";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

const MessagesWrapper = styled.div`
  background-color: #ddddf7;
  padding: 10px;
  height: calc(100% - 100px);
  overflow-y: overlay;
  overflow-x: hidden;
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

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);
  return (
    <MessagesWrapper>
      {messages.map((m: any) => (
        <Message message={m} key={m.id} />
      ))}
    </MessagesWrapper>
  );
};

export default Messages;
