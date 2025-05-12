import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/core/api';
import { clearAuthData } from '@/features/auth/authSlice';
import { BASE_URL, USER } from '@/core/consts';
import { FiLogOut } from 'react-icons/fi'; // 👈 added icon

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`${BASE_URL}${USER.LOGOUT}`, {}, { withCredentials: true });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(clearAuthData());
      toast.success(data?.meta?.message);
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      toast.error(error.response?.data?.meta?.message || 'Logout Error');
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={mutation.isLoading}
      className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-800 transition duration-200"
    >
      <FiLogOut className="text-lg" />
      {mutation.isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
