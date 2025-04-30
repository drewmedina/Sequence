// App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CreateGamePage from "./Pages/CreateGamePage";
import Play from "./Pages/Play";
import Test from "./Pages/Test";
import Header from "./Components/Header";
import { useAuth } from "./Auth/AuthContext";
import ProfilePage from "./Pages/ProfilePage";
function App() {
  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <div style={{ overflow: "hidden", height: "100vh", width: "100vw" }}>
            <Header />
            <Outlet />
          </div>
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "createGame/:gameCode", element: <CreateGamePage /> },
        { path: "play/:gameCode", element: <Play /> },
        { path: "test", element: <Test /> },
        { path: "profile", element: <ProfilePage /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
