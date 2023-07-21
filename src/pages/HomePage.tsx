import { styled } from "styled-components";
import HomeChatContainer from "../containers/HomeChatContainer";
import HomeSidebarContainer from "../containers/HomeSidebarContainer";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useMemo } from "react";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ConversationContext } from "../contexts/ConversationContext";
import { useWindowSize } from "../core/hooks/useWindowSize";
import { ChatContext } from "../contexts/ChatContext";

const HomeContainer = styled.div`
  background-color: #a7bcff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HomeWrapper = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  width: 65%;
  height: 80%;
  display: flex;
  overflow: hidden;
  &.full-view {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

export const WIDTH = 768;

export const updateOnlineStatus = async (
  userId: string,
  state: "online" | "offline"
) => {
  if (userId) {
    try {
      await updateDoc(doc(db, "onlineStatus", userId), {
        state: state,
        lastChanged: Timestamp.now(),
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const HomePage = () => {
  const currentUser = useContext(AuthContext);
  const { conversation } = useContext(ConversationContext);
  const { data } = useContext(ChatContext);
  const userId = useMemo(() => {
    return currentUser?.uid || "";
  }, [currentUser?.uid]);
  const { width } = useWindowSize();

  const isDisplaySidebar = (!data.chatId && width <= WIDTH) || width > WIDTH;

  useEffect(() => {
    updateOnlineStatus(userId, "online");

    window.addEventListener(
      "beforeunload",
      () => {
        updateOnlineStatus(userId, "offline");
      },
      false
    );
  }, [userId, conversation.isForeground]);

  return (
    <HomeContainer>
      <HomeWrapper className={width <= WIDTH ? "full-view" : ""}>
        <HomeSidebarContainer isDisplaySidebar={isDisplaySidebar} />
        <HomeChatContainer windowWidth={width} />
      </HomeWrapper>
    </HomeContainer>
  );
};

export default HomePage;
