import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { BASE_URL, USER } from '@/core/consts';
import toast from 'react-hot-toast';

const ResendVerificationCode = () => {
  const navigate = useNavigate();

  const resendMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${BASE_URL}${USER.RESEND_CODE}`, formData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      navigate('/verify-email', { state: { email: variables.email } });
      toast.success(data?.meta?.message || "Verification code sent successfully")
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.meta?.message || 'Verification failed!')
    },
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-stark-white-100 p-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-stark-white-50 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-stark-white-800">Resend Verification Code</h2>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            resendMutation.mutate(values, {
              onSettled: () => {
                setSubmitting(false); // <-- VERY IMPORTANT to stop Formik's loading state
              }
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-stark-white-800">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 focus:border-stark-white-400 focus:ring-stark-white-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <Button
  type="submit"
  disabled={resendMutation.isPending}
  className="w-full bg-stark-white-800 hover:bg-stark-white-700 text-stark-white-50"
>
  {resendMutation.isPending ? "Sending..." : "Resend Code"}
</Button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResendVerificationCode;
