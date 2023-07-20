import { signOut } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { ChatContext } from "../../../contexts/ChatContext";
import { updateOnlineStatus } from "../../../pages/HomePage";

export const HeaderWrapper = styled.div`
  height: 50px;
  padding: 10px;
  background-color: #2f2d52;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ddddf7;
`;

const Logo = styled.span`
  font-weight: bold;
`;

const User = styled.div`
  display: flex;
  gap: 10px;
  img {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
  button {
    padding: 5px;
    background-color: #5d5b8d;
    color: #ddddf7;
    font-size: 10px;
    border: none;
    cursor: pointer;
  }
`;

const Header = () => {
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  return (
    <HeaderWrapper>
      <Logo>Ole Chat</Logo>
      <User>
        <img src={currentUser?.photoURL || undefined} alt="Avatar" />
        <span>{currentUser?.displayName}</span>
        <button
          onClick={async () => {
            updateOnlineStatus(currentUser?.uid || "", "offline");
            signOut(auth);
            dispatch({ type: "DELETED_USER", payload: [] });
          }}
        >
          Logout
        </button>
      </User>
    </HeaderWrapper>
  );
};
export default Header;
