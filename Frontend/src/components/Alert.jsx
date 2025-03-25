import React, {useEffect, useState} from "react";
import {cn} from "../lib/utils";
import {Info, AlertCircle, CheckCircle2, XCircle, X} from "lucide-react";

export default function Alert(props) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const {message, variant, description, onClose, duration = 5000} = props;

  // Map the alert types to their respective styles;
  const alertStyles = {
    success:
      "border border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400",
    danger:
      "border border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
    warning:
      "border border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400",
    info: "border border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
  };

  // Fallback to a default style if an unrecognized type is passed
  const alertClass = alertStyles[variant] || alertStyles.info;
  useEffect(() => {
    if (duration === 0) return; // Don't auto-dismiss if duration is 0

    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const progressPercent = (remaining / duration) * 100;

      if (remaining <= 0) {
        clearInterval(timer);
        handleClose();
      } else {
        setProgress(progressPercent);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible && !message) return null;

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className='h-5 w-5' />;
      case "danger":
        return <XCircle className='h-5 w-5' />;
      case "warning":
        return <AlertCircle className='h-5 w-5' />;
      case "info":
        return <Info className='h-5 w-5' />;
      default:
        return <Info className='h-5 w-5' />;
    }
  };

  return (
    <div
      className={cn(
        "w-full transition-all duration-300 ease-in-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role='alert'
      aria-live='assertive'>
      <div
        className={cn(
          "relative flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg ",
          alertClass
        )}>
        {getIcon()}
        <div className='flex-1'>
          <h5 className='font-medium leading-tight'>{message}</h5>
          {description && (
            <div className='mt-1 text-sm opacity-90'>{description}</div>
          )}
        </div>
        <button
          type='button'
          onClick={handleClose}
          className='ml-auto inline-flex h-6 w-6 items-center justify-center cursor-pointer rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2'
          aria-label='Close alert'>
          <X className='h-4 w-4' />
        </button>

        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div
            className='absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-100 ease-linear'
            style={{width: `${progress}%`}}
          />
        )}
      </div>
    </div>
  );
}
