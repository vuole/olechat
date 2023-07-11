import { useContext } from "react";
import Header from "../components/Home/Chat/Header";
import InputBox from "../components/Home/Chat/InputBox";
import Messages from "../components/Home/Chat/Messages";
import { ChatContext } from "../contexts/ChatContext";
import { styled } from "styled-components";

const ChatContainer = styled.div`
  flex: 2;
  &.no-chat {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    p {
      color: #c7c6c8;
      font-size: 30px;
      text-align: center;
    }
  }
`;

const HomeChatContainer = () => {
  const { data } = useContext(ChatContext);
  const result = data.chatId ? (
    <ChatContainer>
      <Header data={data.user} />
      <Messages />
      <InputBox />
    </ChatContainer>
  ) : (
    <ChatContainer className="no-chat">
      <p>Choose a chat to start the conversation</p>
    </ChatContainer>
  );
  return result;
};

export default HomeChatContainer;
