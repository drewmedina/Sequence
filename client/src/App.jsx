import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import {AuthProvider} from './Auth/AuthContext';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import {useAuth} from "./Auth/AuthContext"
import Header from './Components/Header';
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
  ]);
  return (
    <AuthProvider>
      <div style={{"overflow":"hidden", "height":"100vh", "width":"100vw"}}>
        <Header/>
        <RouterProvider router={router} />
      </div>
      
    </AuthProvider>
  );


}

export default App
