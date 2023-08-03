import Cam from "../../../assets/images/cam.png";
import Add from "../../../assets/images/add.png";
import More from "../../../assets/images/more.png";
import styled from "styled-components";
import { HeaderWrapper } from "../Sidebar/Header";
import { UserInfo } from "../../../containers/HomeSidebarContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircle as solidFaCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { ConversationContext } from "../../../contexts/ConversationContext";
import { ChatContext } from "../../../contexts/ChatContext";

const ChatIcons = styled.div`
  display: flex;
  gap: 10px;
  img {
    height: 24px;
    cursor: pointer;
  }
`;

const LeftHeader = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  .arrow-left-icon {
    display: none;
    margin-right: 8px;
    margin-top: 2px;
    cursor: pointer;
    @media screen and (max-width: 768px) {
      display: inline;
    }
  }
  a {
    color: lightgray;
    text-decoration: none;
  }
  .online-icon {
    width: 10px;
    height: 10px;
    margin-top: 3px;
  }
`;

export interface OnlineStatusType {
  state: "online" | "offline";
  lastChanged: Timestamp;
}

const Header = ({ data }: { data: UserInfo }) => {
  const { conversation, conversationDispatch } =
    useContext(ConversationContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    return () => {
      conversationDispatch({
        type: "UPDATE_ONLINE_STATUS",
        payload: {},
      });
    };
  }, [data]);

  return (
    <HeaderWrapper style={{ backgroundColor: "#5d5b8d", color: "lightgray" }}>
      <LeftHeader>
        <FontAwesomeIcon
          className="arrow-left-icon"
          onClick={() => {
            dispatch({ type: "DELETED_USER" });
          }}
          icon={faArrowLeft}
          size="sm"
        />
        <a href="#">{data.displayName}</a>
        {conversation.onlineStatus.state && (
          <FontAwesomeIcon
            className="online-icon"
            icon={solidFaCircle}
            size="xs"
            style={{
              color:
                conversation.onlineStatus.state === "online"
                  ? "#00ff00"
                  : "#c0c0c0",
            }}
          />
        )}
      </LeftHeader>
      <ChatIcons>
        {/* <img src={Cam} alt="" />
        <img src={Add} alt="" />
        <img src={More} alt="" /> */}
      </ChatIcons>
    </HeaderWrapper>
  );
};

export default Header;
