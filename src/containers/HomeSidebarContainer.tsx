import { styled } from "styled-components";
import Header from "../components/Home/Sidebar/Header";
import Search from "../components/Home/Sidebar/Search";
import { db } from "../firebase";
import { useContext, useEffect, useState } from "react";
import {
  DocumentData,
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
import { ChatContext } from "../contexts/ChatContext";

const SidebarContainer = styled.div`
  flex: 1;
  background-color: #3e3c61;
  position: relative;
`;

interface ChatType {
  date: Timestamp;
  lastMessage: string;
  userInfo: UserInfo;
}

export type UserInfo = Omit<UserType, "lowercaseDisplayName" | "email">;

interface UserType {
  displayName: string;
  email: string;
  lowercaseDisplayName: string;
  photoURL: string;
  uid: string;
}

const HomeSidebarContainer = () => {
  const currentUser = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<UserType | null>(null); // a user
  const [chats, setChats] = useState<Array<[string, ChatType]>>([]); //Array<[chatId, ChatType]>
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "inbox", currentUser?.uid || ""),
        (doc) => {
          setChats(Object.entries(doc.data() || {}));
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
      setSearchResult(null);
    }
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setSearchResult(doc.data() as UserType);
    });
  };

  const handleClickSearchResult = async () => {
    const combinedId =
      currentUser && searchResult
        ? currentUser.uid > searchResult.uid
          ? currentUser.uid + searchResult.uid
          : searchResult.uid + currentUser.uid
        : "";

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "inbox", currentUser?.uid || ""), {
          [combinedId + ".userInfo"]: {
            uid: searchResult?.uid,
            displayName: searchResult?.displayName,
            photoURL: searchResult?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "inbox", searchResult?.uid || ""), {
          [combinedId + ".userInfo"]: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    setKeyword("");
    setSearchResult(null);
  };

  // c: [chatId, ChatType]
  const handleClickConversation = (c: [string, ChatType]) => {
    dispatch({ type: "CHANGE_USER", payload: c });
  };

  return (
    <SidebarContainer>
      <Header />
      <Search
        value={keyword}
        onChange={setKeyword}
        searchResult={searchResult}
        onClickSearchResult={handleClickSearchResult}
      />
      {chats
        .sort((a: any, b: any) => b[1].date - a[1].date)
        .map((c) => (
          <Chat
            key={c[0]}
            photoURL={c[1].userInfo.photoURL}
            displayName={c[1].userInfo.displayName}
            lastMessage={c[1].lastMessage}
            onClick={() => handleClickConversation(c)}
          />
        ))}
    </SidebarContainer>
  );
};

export default HomeSidebarContainer;
