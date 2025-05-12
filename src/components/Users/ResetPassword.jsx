import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL, USER } from '@/core/consts';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}${USER.RESET_PASSWORD}/${token}`, { password });
      toast.success(res.data.meta.message || 'Password successfully reset!');
      setTimeout(() => navigate('/login'), 1500); // Navigate after 1.5 seconds
    } catch (err) {
      toast.error(err.response?.data?.meta.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto m-20 p-8 border border-stark-white-200 rounded-lg shadow-sm bg-off-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-deep-green">Reset Password</h2>
        <p className="text-stark-white-600 mt-2">Enter your new password below</p>
      </div>
      
      <form onSubmit={handleReset} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-deep-green">
            New Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            className="bg-stark-white-50 border-stark-white-300 focus:ring-2 focus:ring-teal-green"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-green hover:bg-sea-green text-stark-white-50 py-2 rounded-md shadow-sm transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Resetting...
            </>
          ) : (
            'Reset Password'
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

export default ResetPassword;