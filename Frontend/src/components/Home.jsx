import React, {useContext} from "react";
import AlertContext from "../context/alert/AlertContext";
import {Button} from "./ui/button";
import CreateUpdateAccount from "./CreateUpdateAccount";
import Accounts from "./Accounts";
import CreateUpdateTransaction from "./transactionComponent/CreateUpdateTransaction";

const Home = () => {
  return (
    <div className='flex flex-col'>
      <CreateUpdateTransaction />
    </div>
  );
};

export default Home;
