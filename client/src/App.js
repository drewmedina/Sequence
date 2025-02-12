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
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );


}

export default App;
