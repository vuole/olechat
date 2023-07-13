import Cam from "../../../assets/images/cam.png";
import Add from "../../../assets/images/add.png";
import More from "../../../assets/images/more.png";
import styled from "styled-components";
import { HeaderWrapper } from "../Sidebar/Header";
import { UserInfo } from "../../../containers/HomeSidebarContainer";

const ChatIcons = styled.div`
  display: flex;
  gap: 10px;
  img {
    height: 24px;
    cursor: pointer;
  }
`;

const Header = ({ data }: { data: UserInfo }) => {
  return (
    <HeaderWrapper style={{ backgroundColor: "#5d5b8d", color: "lightgray" }}>
      <span>{data.displayName}</span>
      <ChatIcons>
        {/* <img src={Cam} alt="" />
        <img src={Add} alt="" />
        <img src={More} alt="" /> */}
      </ChatIcons>
    </HeaderWrapper>
  );
};

export default Header;
