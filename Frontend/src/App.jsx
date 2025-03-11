import "./App.css";
import BottomNav from "./components/bottomNav";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import TopNav from "./components/topnav";
import Home from "./components/Home";
import Alert from "./components/Alert";

function App() {
  const appName = "Trance";
  return (
    <Router>
      <Alert
        alert={true}
        type='success'
        message='asdasdasdasdasdasd'
        description='sadddddddddddddddddddddddddddd'
      />
      <TopNav />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>

      <BottomNav />
    </Router>
  );
}

export default App;
