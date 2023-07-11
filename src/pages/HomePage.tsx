import { styled } from "styled-components";
import HomeChatContainer from "../containers/HomeChatContainer";
import HomeSidebarContainer from "../containers/HomeSidebarContainer";

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

const HomePage = () => {
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
