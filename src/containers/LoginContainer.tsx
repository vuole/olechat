import { Link, Navigate, useNavigate } from "react-router-dom";
import OCFormWrapper from "../components/FormWrapper/OCFormWrapper";
import OCTextField from "../components/TextField/OCTextField";
import OCButton from "../components/Button/OCButton";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";

const LoginContainer = () => {
  const currentUser = useContext(AuthContext);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  if (currentUser) return <Navigate to="/" />;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      //Create user
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setHasError(true);
    }
  };

  return (
    <OCFormWrapper
      onSubmit={handleSubmit}
      title="Login"
      navigate={
        <>
          You don't have an account? <Link to="/register">Register</Link>
        </>
      }
    >
      <OCTextField placeholder="Email" name="email" />
      <OCTextField type="password" placeholder="Password" name="password" />
      <OCButton>Login</OCButton>
      {hasError && <span>Something went wrong</span>}
    </OCFormWrapper>
  );
};

export default LoginContainer;
