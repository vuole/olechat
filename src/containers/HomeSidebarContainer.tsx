import { styled } from "styled-components";
import Header from "../components/Home/Sidebar/Header";
import Search from "../components/Home/Sidebar/Search";
import { db } from "../firebase";
import { useContext, useEffect, useState } from "react";
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
import { ChatContext } from "../contexts/ChatContext";
import { result } from "lodash";

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

export interface UserType {
  displayName: string;
  email: string;
  lowercaseDisplayName: string;
  photoURL: string;
  uid: string;
}

const HomeSidebarContainer = () => {
  const currentUser = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<UserType | null>(
    {} as UserType
  ); // a user
  const [chats, setChats] = useState<Array<[string, ChatType]>>([]); //Array<[chatId, ChatType]>
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid || ""),
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
      setSearchResult(keyword ? null : {} as UserType);
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
      const res = await getDoc(doc(db, "conversations", combinedId));

      if (!res.exists()) {
        //create a chat in conversations collection
        await setDoc(doc(db, "conversations", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser?.uid || ""), {
          [combinedId + ".userInfo"]: {
            uid: searchResult?.uid,
            displayName: searchResult?.displayName,
            photoURL: searchResult?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", searchResult?.uid || ""), {
          [combinedId + ".userInfo"]: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
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
      },
    ];
    dispatch({ type: "CHANGED_USER", payload: userChat });
    setKeyword("");
    setSearchResult({} as UserType);
  };

  // c: [chatId, ChatType]
  const handleClickChat = (c: [string, ChatType]) => {
    dispatch({ type: "CHANGED_USER", payload: c });
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
            chatId={c[0]}
            photoURL={c[1].userInfo.photoURL}
            displayName={c[1].userInfo.displayName}
            lastMessage={c[1].lastMessage}
            onClick={() => handleClickChat(c)}
          />
        ))}
    </SidebarContainer>
  );
};

export default HomeSidebarContainer;
