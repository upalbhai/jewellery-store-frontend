import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setAuthData, setCartData } from '@/features/auth/authSlice';
import { BASE_URL, USER } from '@/core/consts';
import { unreadCount } from '@/features/notifications/notificationThunks';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async (userCredentials) => {
      const response = await axios.post(`${BASE_URL}${USER.LOGIN}`, userCredentials,{ withCredentials: true });
      return response.data;
    },
    onSuccess:async (data) => {
      const user  = data.data.user; // Assuming the API response includes both token and user data
      dispatch(setAuthData(user));
      dispatch(setCartData(user?.cart));
      await unreadCount(dispatch);
      toast.success(data?.meta?.message);
      navigate('/'); // Adjust the navigation as needed
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.meta?.message || error.message);
      toast.error(error.response?.data?.meta?.message || 'Login failed');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
<div className="flex min-h-screen items-center justify-center bg-stark-white-100">
  <div className="w-full max-w-md m-8 p-8 bg-stark-white-50 shadow-lg rounded-lg">
    <h2 className="text-center text-2xl font-bold text-stark-white-800 mb-8">Login</h2>
    <form className="space-y-6" onSubmit={handleSubmit}>
      {['email', 'password'].map((field) => (
        <div key={field} className="space-y-2">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-stark-white-700 capitalize"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
            type={field === 'password' ? 'password' : 'email'}
            autoComplete={field}
            required
            value={formData[field]}
            onChange={handleChange}
            className="block w-full px-4 py-3 h-12 rounded-md border border-stark-white-300 focus:outline-none focus:ring-2 focus:ring-stark-white-500 focus:border-transparent"
          />
        </div>
      ))}
      <div className="pt-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center items-center rounded-md border border-transparent bg-stark-white-700 py-3 px-4 h-12 text-sm font-medium text-stark-white-50 shadow-sm hover:bg-stark-white-800 focus:outline-none focus:ring-2 focus:ring-stark-white-700 focus:ring-offset-2"
        >
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>

    {/* Add "Want to create an account?" section */}
    <div className="text-center mt-6">
      <p className="text-sm text-deep-green font-bold">
        Don't have an account?{' '}
        <a
          href="/sign-up"
          className="font-medium text-stark-white-950 hover:underline hover:text-stark-white-800"
        >
          Sign up here
        </a>
      </p>
    </div>
    <div className="text-center mt-6">
      <p className="text-sm text-deep-green font-bold">
        Already registered but email not verified?{' '}
        <a
          href="/resend-code"
          className="font-medium text-stark-white-950 hover:underline hover:text-stark-white-800"
        >
          verify email
        </a>
      </p>
    </div>
    <div className="text-center mt-6">
      <p className="text-sm text-deep-green font-bold">
        Don't Remember the password?{' '}
        <a
          href="/forgot-password"
          className="font-medium text-stark-white-950 hover:underline hover:text-stark-white-800"
        >
          forget password
        </a>
      </p>
    </div>
  </div>
</div>


  );
};

export default Login;
