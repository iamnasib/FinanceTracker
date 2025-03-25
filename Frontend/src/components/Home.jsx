import React, {useContext} from "react";
import AlertContext from "../context/alert/AlertContext";
import {Button} from "./ui/button";

const Home = () => {
  const {showAlert} = useContext(AlertContext);

  return (
    <div className='flex w-full max-w-5xl mx-auto p-4'>
      Home
      <Button>HELLo</Button>
      <button
        className='p-2 bg-amber-400 cursor-pointer'
        type='button'
        onClick={() =>
          showAlert("Success! Your changes have been saved.", {
            variant: "success",
            description: "You can view your changes in the dashboard.",
          })
        }>
        Show Success Alert
      </button>{" "}
      <button
        className='p-2 bg-amber-400 cursor-pointer'
        onClick={() =>
          showAlert("Warning! This action cannot be undone.", {
            variant: "warning",
            duration: 8000,
          })
        }
        variant='outline'>
        Show Warning Alert (8s)
      </button>
    </div>
  );
};

export default Home;
