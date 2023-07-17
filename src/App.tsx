import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToken1, onMessageListener } from "./firebase";

function App() {
  const currentUser = useContext(AuthContext);
  // const [notification, setNotification] = useState<any>({
  //   title: "",
  //   body: "",
  // });
  // const [isTokenFound, setTokenFound] = useState(false);

  // getToken1(setTokenFound);

  // onMessageListener()
  //   .then((payload) => {
  //     setNotification({
  //       title: payload.notification.title,
  //       body: payload.notification.body,
  //     });
  //     console.log("payload", payload);
  //   })
  //   .catch((err) => console.log("failed: ", err));

  const ProtectedRoute = ({ children }: any) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
