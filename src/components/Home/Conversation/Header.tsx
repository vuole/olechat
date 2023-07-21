import Cam from "../../../assets/images/cam.png";
import Add from "../../../assets/images/add.png";
import More from "../../../assets/images/more.png";
import styled from "styled-components";
import { HeaderWrapper } from "../Sidebar/Header";
import { UserInfo } from "../../../containers/HomeSidebarContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCircle as solidFaCircle } from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { ConversationContext } from "../../../contexts/ConversationContext";
import { useWindowSize } from "../../../core/hooks/useWindowSize";
import { ChatContext } from "../../../contexts/ChatContext";
import { WIDTH } from "../../../pages/HomePage";

const ChatIcons = styled.div`
  display: flex;
  gap: 10px;
  img {
    height: 24px;
    cursor: pointer;
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
  const { width } = useWindowSize();

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
      <span
        style={{
          display: "flex",
          gap: "3px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {width <= WIDTH && (
          <FontAwesomeIcon
            onClick={() => {
              dispatch({ type: "DELETED_USER" });
            }}
            icon={faArrowLeft}
            size="sm"
            style={{ marginRight: "8px", cursor: "pointer" }}
          />
        )}
        <a href="#" style={{ color: "lightgray", textDecoration: "none" }}>
          {data.displayName}
        </a>
        {conversation.onlineStatus.state && (
          <FontAwesomeIcon
            icon={solidFaCircle}
            size="xs"
            style={{
              color:
                conversation.onlineStatus.state === "online"
                  ? "#00ff00"
                  : "#c0c0c0",
              width: "10px",
              height: "10px",
            }}
          />
        )}
      </span>
      <ChatIcons>
        {/* <img src={Cam} alt="" />
        <img src={Add} alt="" />
        <img src={More} alt="" /> */}
      </ChatIcons>
    </HeaderWrapper>
  );
};

export default Header;
