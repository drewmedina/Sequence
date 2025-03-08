// App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CreateGamePage from "./Pages/CreateGamePage";
import GameScreen from "./Pages/GameScreen";
import Play from "./Pages/Play";
import Test from "./Pages/Test";
import RootLayout from "./Components/RootLayout";
import { useAuth } from "./Auth/AuthContext";

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
          <RootLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "createGame/:gameCode", element: <CreateGamePage /> },
        { path: "play", element: <Play /> },
        { path: "test", element: <Test /> },
        { path: "game/:gameCode", element: <GameScreen /> },
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
