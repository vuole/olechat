import { Link, Navigate, useNavigate } from "react-router-dom";
import OCButton from "../components/Button/OCButton";
import OCFormWrapper from "../components/FormWrapper/OCFormWrapper";
import OCTextField from "../components/TextField/OCTextField";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase.js";
import { useContext, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";

const RegisterContainer = () => {
  const currentUser = useContext(AuthContext);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  if (currentUser) return <Navigate to="/" />;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      displayName: HTMLInputElement;
      email: HTMLInputElement;
      password: HTMLInputElement;
      file: HTMLInputElement;
    };

    const displayName = formElements.displayName.value;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const file = (formElements.file.files || [])[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setHasError(true);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // Add a new document in collection "users"
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              lowercaseDisplayName: displayName.toLowerCase(),
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (err) {
      setHasError(true);
    }
  };
  return (
    <OCFormWrapper
      onSubmit={handleSubmit}
      title="Register"
      navigate={
        <>
          You do have an account? <Link to="/login">Login</Link>
        </>
      }
    >
      <OCTextField placeholder="Display name" name="displayName" />
      <OCTextField placeholder="Email" name="email" />
      <OCTextField type="password" placeholder="Password" name="password" />
      <OCTextField type="file" name="file" />
      <OCButton>Register</OCButton>
      {hasError && <span>Something went wrong</span>}
    </OCFormWrapper>
  );
};

export default RegisterContainer;
