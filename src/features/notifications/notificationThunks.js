// notificationThunks.js
import api from '@/core/api';
import { setNotifications, setUnreadCount } from './notificationSlice';
import { BASE_URL, USER } from '@/core/consts';

export const fetchNotifications = () => async (dispatch) => {
  try {
    const response = await api.get('/notifications');
    dispatch(setNotifications(response.data));
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};

export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    await api.patch(`/notifications/${notificationId}/read`);
    dispatch(markAsRead(notificationId));
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};

export const deleteNotification = (notificationId) => async (dispatch) => {
  try {
    await api.delete(`/notifications/${notificationId}`);
    dispatch(deleteNotification(notificationId));
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
};

export const unreadCount = async(dispatch)=>{
    try {
        const response = await api.get(`${BASE_URL}${USER.UNREAD_NOTIFICATIONS}`,{
            withCredentials:true
          });
        dispatch(setUnreadCount(response.data.data.unreadCount))
    } catch (error) {
        console.error('Failed to delete notification:', error);
    }
  }


  