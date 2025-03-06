import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import {AuthProvider} from './Auth/AuthContext';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Lobby from './Pages/Lobby';
import {useAuth} from "./Auth/AuthContext";
import Header from './Components/Header';
import Play from './Pages/Play';
import Test from './Pages/Test';

import CreateGamePage from './Pages/CreateGamePage';
import GameScreen from './Pages/GameScreen';

function App() {
    const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element :(
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/signup",
      element: <Signup/>,
    },
    {
      path: "/play",
      element: <Play/>,
    },
    {
      path: "/test",
      element: <Test/>,
    },
      path: "/createGame/:gameCode",
      element: <CreateGamePage/>
    },
    {
      path: "/game/:gameCode",
      element: <GameScreen />
    }
  ]);
  return (
    <AuthProvider>
      <div style={{"overflow":"hidden", "height":"100vh", "width":"100vw"}}>
        <Header/>
        <div style={{"height":"94%"}}>
          <RouterProvider router={router} />
        </div>
      </div>
    </AuthProvider>
  );


}

export default App
