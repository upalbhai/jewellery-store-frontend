import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BASE_URL, USER } from '@/core/consts';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: {
      line: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post(`${BASE_URL}${USER.SIGNUP}`, newUser);
      return response.data;
    },
    onSuccess: (data) => {
        navigate('/verify-email', { state: { email: formData.email } });
        toast.success(data.meta.message);
      },
      
    onError: (error) => {
      console.error('Registration failed:', error.response?.data?.meta?.message || error.message);
      toast.error(error.response?.data?.meta?.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['line', 'line2', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
<div className="flex min-h-screen items-center pt-20 justify-center bg-stark-white-100">
  <div className="w-full m-8  max-w-xl p-8 bg-stark-white-50 shadow-lg rounded-lg">
    <h2 className="text-center text-2xl font-bold text-stark-white-900 mb-6">Signup</h2>
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Main Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['name', 'email', 'password', 'phoneNumber'].map((field) => (
          <div key={field} className={field === 'name' || field === 'password' ? 'md:col-span-1' : 'md:col-span-1'}>
            <label htmlFor={field} className="block text-sm font-medium text-stark-white-800 capitalize mb-1">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              id={field}
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              autoComplete={field}
              required
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 h-10 rounded-md border border-stark-white-300 focus:outline-none focus:ring-2 focus:ring-stark-white-500"
            />
          </div>
        ))}
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {['line', 'line2', 'city', 'state', 'zipCode'].map((field) => (
          <div key={field} className={field === 'line' || field === 'line2' ? 'md:col-span-2' : 'md:col-span-1'}>
            <label htmlFor={field} className="block text-sm font-medium text-stark-white-800 capitalize mb-1">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              autoComplete={field}
              required
              value={formData.address[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 h-10 rounded-md border border-stark-white-300 focus:outline-none focus:ring-2 focus:ring-stark-white-500"
            />
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 flex justify-center items-center rounded-md border border-transparent bg-stark-white-600 text-sm font-medium text-white shadow-sm hover:bg-stark-white-700 focus:outline-none focus:ring-2 focus:ring-stark-white-500 focus:ring-offset-2"
        >
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>

    {/* Already have account */}
    <div className="text-center mt-6">
      <p className="text-sm font-bold text-deep-green">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-stark-white-950 hover:underline">
          Login here
        </a>
      </p>
    </div>
  </div>
</div>
  );
};

export default Signup;
