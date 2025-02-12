import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'

import Home from './Pages/Home';
import Login from './Pages/Login';
import {useAuth} from "./Auth/AuthContext"
function App() {
  // const { currentUser } = useAuth();
  const ProtectedRoute = ({ children }) => {
    if (true) {
      return <Navigate to="/login" />;
    }
    return children;
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
  ]);
  return (
    <div>Hello World!</div>
  );


}

export default App;
