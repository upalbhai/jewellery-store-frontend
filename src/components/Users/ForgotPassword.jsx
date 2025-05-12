import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL, USER } from '@/core/consts';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '../ui/label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}${USER.FORGOT_PASSWORD}`, { email });
      toast.success(res.data.meta.message || 'Password reset email sent!');
      setTimeout(() => navigate('/login'), 2000); // Navigate to login after 2 seconds
    } catch (err) {
      toast.error(err.response?.data?.meta.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto m-20 p-8 border border-stark-white-200 rounded-lg shadow-sm bg-off-white">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center w-14 h-14 bg-pale-teal rounded-full mb-4">
          <Mail className="w-6 h-6 text-teal-green" />
        </div>
        <h2 className="text-2xl font-bold text-deep-green">Forgot Password</h2>
        <p className="text-stark-white-600 mt-2">
          Enter your email to receive a password reset link
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-deep-green">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-stark-white-50 border-stark-white-300 focus:ring-2 focus:ring-teal-green"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-green hover:bg-sea-green text-stark-white-50 py-3 rounded-md shadow-sm transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-stark-white-600">
        Remember your password?{' '}
        <a 
          href="/login" 
          className="text-teal-green hover:text-sea-green font-medium"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
        >
          Login here
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;