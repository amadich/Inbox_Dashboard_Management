import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  duration?: number; // Optional: How long the toast will stay on screen (in milliseconds)
  onClose: () => void; // Callback to close the toast
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Call onClose after the toast disappears
    }, duration);

    return () => clearTimeout(timer); // Cleanup the timeout on unmount
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
      style={{ zIndex: 999 }}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
}
