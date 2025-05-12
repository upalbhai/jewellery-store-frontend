import React, { useState, useEffect } from 'react';
import { getNotification, markAsReadNotification, deleteNotification, marksAsReadAllNotifications } from '@/core/requests';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { unreadCount } from '@/features/notifications/notificationThunks';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
    limit: 10
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getNotification({ 
        page, 
        limit: pagination.limit,
        filter 
      });
      
      setNotifications(response.data);
      setPagination({
        ...pagination,
        currentPage: page,
        totalPages: response.meta.pagination.totalPages,
        totalNotifications: response.meta.pagination.totalNotifications
      });
    } catch (error) {
      toast.error(error.response.data.meta.message ||'Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await markAsReadNotification(notificationId);
      if(response.meta.success){
        setNotifications(notifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        ));
        toast.success('Notification marked as read');
        unreadCount(dispatch);
      }
    } catch (error) {
      toast.error(error.message,'Failed to mark as read');
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await deleteNotification(notificationId);
      if(response.meta.success){
        setNotifications(notifications.filter(n => n._id !== notificationId));
        toast.success('Notification deleted');
        fetchNotifications(pagination.currentPage);
        unreadCount(dispatch);
      }
    } catch (error) {
      toast.error( error.response.data.meta.message||'Failed to delete notification');
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await marksAsReadAllNotifications();
      if(response?.meta?.success){
        toast.success(response.meta.message || 'All notifications are read');
        unreadCount(dispatch);
        fetchNotifications(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response.data.meta.message||'Failed to mark all as read');
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await deleteNotification();
      if(response?.meta?.success){
        setNotifications([]);
        unreadCount(dispatch);
        toast.success(response.meta.message ||'All notifications deleted');
        fetchNotifications(1);
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      toast.error(error.response.data.meta.message||'Failed to delete all notifications');
      console.error('Error deleting all notifications:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Notifications</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={handleMarkAllAsRead}
            className="bg-pale-teal border-2 border-deep-green hover:bg-blue-300"
          >
            Mark All as Read
          </Button>
          
          <Dialog  open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogTrigger asChild>
              <Button className='bg-red-700 border-2 border-red-900 text-off-white' variant="destructive">
                Delete All
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-mint-cream'>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete all your notifications.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className='bg-blue-400' variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAll}
                  className='bg-red-700 border-2 border-red-900 text-off-white'
                >
                  Delete All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 flex space-x-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className='bg-light-teal'
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className='bg-light-teal'
        >
          Unread
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
          className='bg-light-teal'
        >
          Read
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sea-green"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No notifications found
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 border rounded-lg ${!notification.read ? 'bg-off-white border-sea-green' : 'bg-white border-gray-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-dark-green">{notification.message}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.moreDetails}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.location && (
                      <a 
                        href={notification.location} 
                        className="text-xs text-sea-green hover:underline mt-1 inline-block"
                      >
                        View related page
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="bg-sea-green hover:bg-teal-green"
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className='bg-red-700 border-2 border-red-900 text-off-white'
                      variant="destructive"
                      onClick={() => handleDelete(notification._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                variant="outline"
                onClick={() => fetchNotifications(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => fetchNotifications(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserNotifications;