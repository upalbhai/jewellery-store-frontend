import React from 'react'
import { FaBell } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {

    const { unreadCount } = useSelector((state) => state.notifications);
const navigate = useNavigate();
  return (
    <div className="relative cursor-pointer text-stark-white-700 hover:text-black">
      <FaBell onClick={()=>navigate(`/profile/notifications`)} size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  )
}

export default NotificationBell
