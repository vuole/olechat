import { styled } from "styled-components";
import Header from "../components/Home/Sidebar/Header";
import Search from "../components/Home/Sidebar/Search";
import { db } from "../firebase";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import Chat from "../components/Home/Sidebar/Chat";
import { ChatContext, LastMessageType } from "../contexts/ChatContext";
import { playSound } from "../components/Home/Conversation/Messages";
import { ConversationContext } from "../contexts/ConversationContext";
import { User } from "firebase/auth";

const SidebarContainer = styled.div`
  flex: 1;
  background-color: #3e3c61;
  position: relative;
  &.none {
    display: none;
  }
`;

interface ChatType {
  date: Timestamp;
  lastMessage: LastMessageType;
  userInfo: UserInfo;
}

export type UserInfo = Omit<UserType, "lowercaseDisplayName" | "email">;

export interface UserType {
  displayName: string;
  email: string;
  lowercaseDisplayName: string;
  photoURL: string;
  uid: string;
}

let cachedMessageId: string = "";
let titleInterval: any = null;
let pageTitle: string = "Ole Chat";
let newTitle: string = `New Messages - ${pageTitle}`;

function flashTitle(pageTitle: string, newTitle: string) {
  document.title == pageTitle
    ? (document.title = newTitle)
    : (document.title = pageTitle);
}

interface HomeSidebarContainerProps {
  isDisplaySidebar: boolean;
}

const HomeSidebarContainer = ({ isDisplaySidebar }: HomeSidebarContainerProps) => {
  const currentUser = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<UserType | null>(
    {} as UserType
  ); // a user
  const [chats, setChats] = useState<Array<[string, ChatType]>>([]); //Array<[chatId, ChatType]>
  const { data, dispatch } = useContext(ChatContext);
  const { conversation, conversationDispatch } =
    useContext(ConversationContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid || ""),
        (doc) => {
          const userChats = Object.entries(doc.data() || {}).sort(
            (a: any, b: any) => b[1].date - a[1].date
          );
          setChats(userChats);
        }
      );
      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(getData);
  }, [keyword]);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("lowercaseDisplayName", "==", keyword.toLowerCase())
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setSearchResult(keyword ? null : ({} as UserType));
    }
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setSearchResult(doc.data() as UserType);
    });
  };

  const combinedId = useMemo(() => {
    return currentUser && searchResult
      ? currentUser.uid > searchResult.uid
        ? currentUser.uid + searchResult.uid
        : searchResult.uid + currentUser.uid
      : "";
  }, [currentUser, searchResult]);

  const createUserChat = async (
    userChatId: string,
    userInfo: User | UserType | null
  ) => {
    await updateDoc(doc(db, "userChats", userChatId), {
      [combinedId + ".userInfo"]: {
        uid: userInfo?.uid,
        displayName: userInfo?.displayName,
        photoURL: userInfo?.photoURL,
      },
      [combinedId + ".date"]: Timestamp.now(),
    });
  };
  const handleClickSearchResult = async () => {
    try {
      const res = await getDoc(doc(db, "conversations", combinedId));
      //nếu chưa có cuộc hội thoại với người dùng được tìm thấy
      if (!res.exists()) {
        //tạo cuộc hội thoại rỗng
        await setDoc(doc(db, "conversations", combinedId), { messages: [] });

        //Tạo chat cho người dùng hiện tại và người dùng được tìm thấy
        createUserChat(currentUser?.uid || "", searchResult);

        createUserChat(searchResult?.uid || "", currentUser);
      }
    } catch (err) {}

    const userChat = [
      combinedId,
      {
        userInfo: {
          displayName: searchResult?.displayName,
          photoURL: searchResult?.photoURL,
          uid: searchResult?.uid,
        },
        lastMessage: {} as LastMessageType,
      },
    ];
    //dispatch để mở cuộc hội thoại với người dùng được tìm thấy trên UI
    dispatch({ type: "CHANGED_USER", payload: userChat });
    //Đặt lại searchbox
    setKeyword("");
    setSearchResult({} as UserType);
  };

  // c: [chatId, ChatType]
  const handleClickChat = (c: [string, ChatType]) => {
    dispatch({ type: "CHANGED_USER", payload: c });
  };

  const updateLastMessageIsSeen = async (lastMessage: LastMessageType) => {
    await updateDoc(doc(db, "userChats", currentUser?.uid || ""), {
      [data.chatId + ".lastMessage"]: {
        lastMessage: lastMessage.lastMessage,
        senderId: lastMessage.senderId,
        isSeen: true,
      },
    });
  };
  useEffect(() => {
    //Nếu có tin nhắn đến mà focus vào messageInput thì cập nhật là đã xem
    if (
      chats.length &&
      chats[0][1].lastMessage &&
      !chats[0][1].lastMessage?.isSeen &&
      chats[0][0] === data.chatId &&
      conversation.isFocusMessageInput
    ) {
      updateLastMessageIsSeen(chats[0][1].lastMessage);
    }
    //Nếu có tin nhắn đến mà bấm chọn chat đấy thì cập nhật là đã xem
    if (
      Object.keys(data.lastMessage || {}).length > 0 &&
      data.lastMessage &&
      !data.lastMessage.isSeen
    ) {
      dispatch({ type: "IS_SEEN" });
      updateLastMessageIsSeen(data.lastMessage);
    }
  }, [chats, data, conversation]);

  const visibilityChange = () => {
    conversationDispatch({
      type: "UPDATE_IS_FOREGROUND",
      payload: !document.hidden,
    });
  };
  useEffect(() => {
    //Thay đổi web page's title khi đang duyệt trang khác mà có tin nhắn đến
    document.addEventListener("visibilitychange", visibilityChange);
    if (
      chats.length &&
      !chats[0][1].lastMessage?.isSeen &&
      !conversation.isForeground &&
      cachedMessageId !== chats[0][1].lastMessage?.id
    ) {
      titleInterval = setInterval(flashTitle, 1500, pageTitle, newTitle);
    } else {
      clearInterval(titleInterval);
      titleInterval = null;
      cachedMessageId = (chats[0] || [{}])[1]?.lastMessage?.id;
      document.title = pageTitle;
    }
    return () => {
      document.removeEventListener("visibilitychange", visibilityChange);
      clearInterval(titleInterval);
    };
  }, [chats, conversation.isForeground]);

  useEffect(() => {
    //phát âm thông báo khi có tin nhắn đến
    if (chats.length && !chats[0][1].lastMessage?.isSeen) {
      playSound();
    }
  }, [chats]);

  return (
    <SidebarContainer className={!isDisplaySidebar ? "none" : ""}>
      <Header />
      <Search
        value={keyword}
        onChange={setKeyword}
        searchResult={searchResult}
        onClickSearchResult={handleClickSearchResult}
      />
      {chats.map((c) => (
        <Chat
          key={c[0]}
          chatId={c[0]}
          photoURL={c[1].userInfo.photoURL}
          displayName={c[1].userInfo.displayName}
          userChatId={c[1].userInfo.uid}
          lastMessage={c[1]?.lastMessage}
          onClick={() => handleClickChat(c)}
        />
      ))}
    </SidebarContainer>
  );
};

export default HomeSidebarContainer;
