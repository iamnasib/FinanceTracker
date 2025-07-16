import "./App.css";
import BottomNav from "./components/bottomNav";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import TopNav from "./components/topnav";
import Home from "./components/Home";
import SignupForm from "./components/SignupForm";
import {useContext, useState, useEffect} from "react";
import AuthContext from "./context/auth/AuthContext";
import LoginForm from "./components/LoginForm";
import CreateUpdateAccount from "./components/CreateUpdateAccount";
import Accounts from "./components/Accounts";
import Categories from "./components/categoryComponent/Categories";
import CreateUpdateCategory from "./components/categoryComponent/CreateUpdateCategory";
import Transactions from "./components/transactionComponent/Transactions";
import CreateUpdateTransaction from "./components/transactionComponent/CreateUpdateTransaction";

function App() {
  const appName = "Trance";
  const authContext = useContext(AuthContext);
  const {isAuthenticated} = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);
    };
    checkAuth();
  }, [isAuthenticated]); // Dependencies array is empty to run only on mount

  return (
    <Router>
      <TopNav appName={appName} isAuthenticated={isLoggedIn} />

      <Routes>
        <Route path='/' element={<Transactions />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/login' element={<LoginForm />} />

        {/* Accounts Routes */}
        <Route path='/add-account' element={<CreateUpdateAccount />} />
        <Route path='/update-account/:id' element={<CreateUpdateAccount />} />
        <Route path='/accounts' element={<Accounts />} />

        {/* Categories Routes */}
        <Route path='/categories' element={<Categories />} />
        <Route path='/add-category' element={<CreateUpdateCategory />} />
        <Route path='/update-category/:id' element={<CreateUpdateCategory />} />

        {/* Transactions Routes */}
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/add-transaction' element={<CreateUpdateTransaction />} />
        <Route
          path='/update-transaction/:id'
          element={<CreateUpdateTransaction />}
        />
      </Routes>
      {isLoggedIn && <BottomNav />}
    </Router>
  );
}

export default App;
