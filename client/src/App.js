import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import {AuthProvider} from './Auth/AuthContext';
import Home from './Pages/Home';
import Login from './Pages/Login';
import {useAuth} from "./Auth/AuthContext"
function App() {
const { currentUser } = useAuth();
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
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
    <AuthProvider>
      <Login/>
    </AuthProvider>
  );


}

export default App;
