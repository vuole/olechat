import { styled } from "styled-components";
import HomeChatContainer from "../containers/HomeChatContainer";
import HomeSidebarContainer from "../containers/HomeSidebarContainer";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useMemo } from "react";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ConversationContext } from "../contexts/ConversationContext";

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
`;

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
  const userId = useMemo(() => {
    return currentUser?.uid || "";
  }, [currentUser?.uid]);

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
      <HomeWrapper>
        <HomeSidebarContainer />
        <HomeChatContainer />
      </HomeWrapper>
    </HomeContainer>
  );
};

export default HomePage;
