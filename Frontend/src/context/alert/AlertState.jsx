import React, {useState, useCallback} from "react";
import AlertContext from "./AlertContext";
import Alert from "../../components/Alert";
import {v4 as uuidv4} from "uuid";
AlertContext;
const AlertState = (props) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, options = {}) => {
    const id = uuidv4();
    const newAlert = {
      id,
      message,
      variant: options.variant || "info",
      duration: options.duration || 5000,
      description: options.description,
    };

    setAlerts((prev) => [...prev, newAlert]);
    return id;
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const dismissAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider
      value={{alerts, showAlert, dismissAlert, dismissAllAlerts}}>
      {props.children}
      <div className='fixed top-8 right-6 z-50 flex flex-col gap-3 w-full max-w-sm'>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            description={alert.description}
            variant={alert.variant}
            duration={alert.duration}
            onClose={() => dismissAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertState;
