import styled from "styled-components";
import Attach from "../../../assets/images/attach.png";
import Img from "../../../assets/images/img.png";
import { useContext, useState } from "react";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../../firebase";
import { ChatContext } from "../../../contexts/ChatContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = styled.div`
  height: 50px;
  background-color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    width: 100%;
    border: none;
    outline: none;
    color: #2f2d52;
    font-size: 18px;

    &::placeholder {
      color: lightgray;
    }
  }
`;

const Send = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    height: 24px;
    cursor: pointer;
  }

  button {
    border: none;
    padding: 10px 15px;
    color: white;
    background-color: #8da4f1;
    cursor: pointer;
  }
`;

const InputBox = ({}: any) => {
  const [messageText, setMessageText] = useState("");
  const [messagePhoto, setMessagePhoto] = useState(null);
  const { data } = useContext(ChatContext);
  const currentUser = useContext(AuthContext);

  const handleSentMessage = async (e: any) => {
    if (e.key == "Enter" && (messageText != "" || messagePhoto != null)) {
      if (messagePhoto) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, messagePhoto);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            // setHasError(true);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    messageText,
                    senderId: currentUser?.uid,
                    date: Timestamp.now(),
                    messagePhoto: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            messageText,
            senderId: currentUser?.uid,
            date: Timestamp.now(),
          }),
        });
      }

      await updateDoc(doc(db, "inbox", currentUser?.uid || ""), {
        [data.chatId + ".lastMessage"]: messagePhoto
          ? "sent a photo"
          : messageText,
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "inbox", data.user.uid), {
        [data.chatId + ".lastMessage"]: messagePhoto
          ? "sent a photo"
          : messageText,
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setMessageText("");
      setMessagePhoto(null);
    }
  };
  return (
    <Input>
      <input
        type="text"
        placeholder="Type something..."
        value={messageText}
        onKeyUp={(e) => handleSentMessage(e)}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <Send>
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e: any) => setMessagePhoto(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={() => handleSentMessage({ key: "Enter" })}>
          Send
        </button>
      </Send>
    </Input>
  );
};

export default InputBox;
