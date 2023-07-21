import { useContext } from "react";
import Header from "../components/Home/Conversation/Header";
import InputBox from "../components/Home/Conversation/InputBox";
import Messages from "../components/Home/Conversation/Messages";
import { ChatContext } from "../contexts/ChatContext";
import { styled } from "styled-components";
import { WIDTH } from "../pages/HomePage";

const ChatContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
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

interface HomeChatContainerProps {
  windowWidth: number;
}

const HomeChatContainer = ({ windowWidth }: HomeChatContainerProps) => {
  const { data } = useContext(ChatContext);
  const result = data.chatId ? (
    <ChatContainer>
      <Header data={data.user} />
      <Messages />
      <InputBox />
    </ChatContainer>
  ) : (
    (windowWidth > WIDTH && (
      <ChatContainer className="no-chat">
        <p>Choose a chat to start the conversation</p>
      </ChatContainer>
    )) || <></>
  );
  return result;
};

export default HomeChatContainer;
