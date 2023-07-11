import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext<User | null>({} as User);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>({} as User);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log("user", user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
