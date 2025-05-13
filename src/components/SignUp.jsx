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

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: {
      line: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const navigate = useNavigate();

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
        
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
        
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/[A-Z]/.test(value)) error = 'Password must contain at least one uppercase letter';
        else if (!/[a-z]/.test(value)) error = 'Password must contain at least one lowercase letter';
        else if (!/[0-9]/.test(value)) error = 'Password must contain at least one number';
        else if (!/[^A-Za-z0-9]/.test(value)) error = 'Password must contain at least one special character';
        break;
        
      case 'phoneNumber':
        if (!value) error = 'Phone number is required';
        else if (!/^[0-9]{10}$/.test(value)) error = 'Phone number must be 10 digits';
        break;
        
      case 'zipCode':
        if (!value) error = 'Zip code is required';
        else if (!/^[0-9]{6}$/.test(value)) error = 'Zip code must be 6 digits';
        break;
        
      case 'line':
      case 'city':
      case 'state':
        if (!value.trim()) error = 'This field is required';
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else if (name in errors.address) {
      setErrors(prev => ({
        ...prev,
        address: { ...prev.address, [name]: '' }
      }));
    }
    
    if (['line', 'line2', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (['line', 'line2', 'city', 'state', 'zipCode'].includes(name)) {
      setErrors(prev => ({
        ...prev,
        address: { ...prev.address, [name]: error }
      }));
    } else {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      phoneNumber: validateField('phoneNumber', formData.phoneNumber),
      address: {
        line: validateField('line', formData.address.line),
        city: validateField('city', formData.address.city),
        state: validateField('state', formData.address.state),
        zipCode: validateField('zipCode', formData.address.zipCode),
      },
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => 
      typeof error === 'string' ? error : Object.values(error).some(e => e)
    );
  };

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
      toast.error(error.response?.data?.meta?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  return (
    <div className="flex min-h-screen items-center pt-20 justify-center bg-stark-white-100">
      <div className="w-full m-8 max-w-xl p-8 bg-stark-white-50 shadow-lg rounded-lg">
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
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 h-10 rounded-md border ${
                    errors[field] ? 'border-red-500' : 'border-stark-white-300'
                  } focus:outline-none focus:ring-2 focus:ring-stark-white-500`}
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                )}
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
                  required={field !== 'line2'}
                  value={formData.address[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 h-10 rounded-md border ${
                    errors.address[field] ? 'border-red-500' : 'border-stark-white-300'
                  } focus:outline-none focus:ring-2 focus:ring-stark-white-500`}
                />
                {errors.address[field] && (
                  <p className="mt-1 text-sm text-red-600">{errors.address[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-12 flex justify-center items-center rounded-md border border-transparent bg-stark-white-600 text-sm font-medium text-white shadow-sm hover:bg-stark-white-700 focus:outline-none focus:ring-2 focus:ring-stark-white-500 focus:ring-offset-2 disabled:opacity-75"
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