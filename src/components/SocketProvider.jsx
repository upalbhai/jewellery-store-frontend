import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/core/socket";
import { toast } from "react-hot-toast";
import { unreadCount } from "@/features/notifications/notificationThunks";

const SocketManager = () => {
  const { user } = useSelector((state) => state.auth);
  const joinedRoom = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id || joinedRoom.current) return;

    console.log("Emitting joinRoom with ID:", user._id);
    socket.emit("joinRoom", user._id, (response) => {
      if (response?.success) {
        joinedRoom.current = true;
        toast.success("Connected to real-time service");
      } else {
        toast.error("Failed to connect to real-time service");
      }
    });

    return () => {
      if (user?._id) {
        socket.emit("leaveRoom", user._id);
        joinedRoom.current = false;
      }
    };
  }, [user?._id]);

  useEffect(() => {
    const handleNotification = (data) => {
      // Show toast notification
      toast(data.message, {
        icon: '🔔',
        duration: 5000,
        position: 'top-right'
      });
      unreadCount(dispatch);
      // Optional: Show browser notification if available
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(data.message || "New notification");
      }
    };

    socket.on("sendNotification", handleNotification);

    return () => {
      socket.off("sendNotification", handleNotification);
    };
  }, []);

  return null;
};

export default SocketManager;