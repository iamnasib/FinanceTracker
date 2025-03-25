import "./App.css";
import BottomNav from "./components/bottomNav";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import TopNav from "./components/topnav";
import Home from "./components/Home";
import SignupForm from "./components/SignupForm";
import {useContext, useState, useEffect} from "react";
import AuthContext from "./context/auth/AuthContext";

function App() {
  const appName = "Trance";
  const authContext = useContext(AuthContext);
  const {isAuthenticated} = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoggedIn(await isAuthenticated());
    };
    checkAuth();
  }, [isAuthenticated]);

  return (
    <Router>
      <TopNav appName={appName} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignupForm />} />
      </Routes>
      {/* <BottomNav /> */}
      {isLoggedIn && <BottomNav />}
    </Router>
  );
}

export default App;
