import styled from "styled-components";
import Attach from "../../../assets/images/attach.png";
import Img from "../../../assets/images/img.png";
import { useContext, useEffect, useState } from "react";
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 10px;
`;

const Preview = styled.div`
  position: relative;
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  span {
    position: absolute;
    top: -8px;
    left: -3px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 18px;
    background-color: #3e4042;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: #626568;
    }
  }
`;

const Input = styled.div`
  height: auto;
  background-color: white;
  padding: 10px 0;
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

const InputBox = () => {
  const currentUser = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const textMessage = data.messages[data.chatId]?.textMessage;
  const photoMessage = data.messages[data.chatId]?.photoMessage;
  const [preview, setPreview] = useState<string | undefined>();

  const handleSentMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == "Enter" && (textMessage || photoMessage)) {
      dispatch({ type: "SENT_MESSAGE" });
      if (photoMessage) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, photoMessage);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "conversations", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    textMessage: textMessage || "",
                    senderId: currentUser?.uid,
                    date: Timestamp.now(),
                    photoMessage: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } else {
        await updateDoc(doc(db, "conversations", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            textMessage,
            senderId: currentUser?.uid,
            date: Timestamp.now(),
          }),
        });
      }

      await updateDoc(doc(db, "userChats", currentUser?.uid || ""), {
        [data.chatId + ".lastMessage"]: photoMessage
          ? "sent a photo"
          : textMessage,
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: photoMessage
          ? "sent a photo"
          : textMessage,
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    if (!photoMessage) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(photoMessage);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoMessage]);

  return (
    <InputWrapper>
      {preview && (
        <Preview>
          <img src={preview} alt="previewPhoto" />
          <span
            onClick={() => {
              dispatch({
                type: "EDITED_MESSAGE",
                payload: {
                  textMessage,
                  photoMessage: null,
                },
              });
              setPreview(undefined);
            }}
          >
            x
          </span>
        </Preview>
      )}
      <Input>
        <input
          type="text"
          placeholder="Type something..."
          value={(textMessage as string) || ""}
          onKeyUp={(e) => handleSentMessage(e)}
          onChange={(e) => {
            dispatch({
              type: "EDITED_MESSAGE",
              payload: { textMessage: e.target.value, photoMessage },
            });
          }}
        />
        <Send>
          {/* <img src={Attach} alt="attach" /> */}
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            id="file"
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
            onChange={(e) => {
              dispatch({
                type: "EDITED_MESSAGE",
                payload: {
                  textMessage,
                  photoMessage: (e.target.files || [])[0],
                },
              });
            }}
          />
          <label htmlFor="file">
            <img src={Img} alt="img" />
          </label>
          <button
            onClick={() =>
              handleSentMessage({
                key: "Enter",
              } as React.KeyboardEvent<HTMLInputElement>)
            }
          >
            Send
          </button>
        </Send>
      </Input>
    </InputWrapper>
  );
};

export default InputBox;
