import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input'; // adjust import if needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BASE_URL, USER } from '@/core/consts';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post(`${BASE_URL}${USER.VERIFY_EMAIL}`, {...payload,email});
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.meta?.message || 'Email verified successfully!');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.meta?.message || 'Verification failed!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit code.');
      return;
    }
    mutation.mutate({ code });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stark-white-50 px-4">
      <Card className="w-full max-w-md shadow-lg bg-stark-white-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-stark-white-900">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-stark-white-800 mb-1">
                6-digit Verification Code
              </label>
              <Input
                id="code"
                name="code"
                type="text"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="bg-stark-white-50 border border-stark-white-300 focus:border-stark-white-500 focus:ring-stark-white-500"
              />
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-stark-white-500 hover:bg-stark-white-600 text-white font-medium"
            >
              {mutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
