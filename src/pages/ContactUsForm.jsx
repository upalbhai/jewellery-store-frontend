import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL, USER } from '@/core/consts';

const validationSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  message: Yup.string().required('Message is required'),
});

export function ContactUsForm() {
  const initialValues = { name: '', email: '', phone: '', message: '' };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await axios.post(`${BASE_URL}${USER.CONTACT_US}`, values);
      toast.success('Your message has been sent!');
      resetForm();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl m-8 mx-auto p-8 bg-off-white rounded-xl shadow-lg border border-pale-teal">
      <h2 className="text-3xl font-bold text-deep-green mb-8 text-center">Contact Us</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
              { id: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter your phone number' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-1">
                <Label htmlFor={id} className="text-sea-green font-medium">{label}</Label>
                <Field
                  as={Input}
                  type={type}
                  id={id}
                  name={id}
                  placeholder={placeholder}
                  className="border-sea-green focus:ring-teal-green"
                />
                <ErrorMessage name={id} component="p" className="text-red-500 text-sm" />
              </div>
            ))}

            <div className="space-y-1">
              <Label htmlFor="message" className="text-sea-green font-medium">Your Message</Label>
              <Field
                as={Textarea}
                name="message"
                id="message"
                placeholder="Write your message here..."
                className="border-sea-green focus:ring-teal-green min-h-[150px]"
              />
              <ErrorMessage name="message" component="p" className="text-red-500 text-sm" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sea-green hover:bg-teal-green text-white font-semibold py-3 transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
