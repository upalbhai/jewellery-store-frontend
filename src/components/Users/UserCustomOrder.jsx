import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, UploadCloud } from "lucide-react";
import { customOrder, sendAdminNotification } from "@/core/requests";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const validationSchema = Yup.object({
  images: Yup.array()
    .min(1, "Please upload at least one image.")
    .max(5, "You can upload up to 5 images."),
  message: Yup.string()
    .required("Please provide a message for your design request.")
    .min(10, "Message must be at least 10 characters."),
});

const UserCustomOrder = () => {
  const [images, setImages] = useState([]);
const {user} = useSelector((state)=>state.auth)
  const handleImageUpload = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    if (files.length + images.length > 5) {
      toast.error('Upload limit, upload only 5 images');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setFieldValue("images", updatedImages);
  };

  const handleRemoveImage = (index, setFieldValue) => {
    const updatedImages = images.filter((_, i) => i !== index);
    URL.revokeObjectURL(images[index].preview);
    setImages(updatedImages);
    setFieldValue("images", updatedImages);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (images.length === 0) {
      toast.error('please select images');
      return;
    }

    const formData = new FormData();
    images.forEach((img) => {
      formData.append("images", img.file);
    });
    formData.append("message", values.message);

    try {
      const response = await customOrder(formData);
      
      if (response?.meta?.success) {
          toast.success(response.meta.message || 'Custom order submitted successfully');
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
        let notifiObj={
            message:`Custom Order submitted by user ${user.name}`,
            location:'/admin/custom-orders',
            moreDetails:`Please check this`
        };
        sendAdminNotification(notifiObj)
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.meta?.message || "Something went wrong.");
      console.error("Custom Order Error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <Card className="border-0 shadow-lg bg-off-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-deep-green">
            Submit Your Custom Design
          </CardTitle>
          <CardDescription className="text-slate-green">
            Upload up to 5 design images and describe your idea.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Formik
            initialValues={{ images: [], message: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form>
                {/* Upload Button */}
                <div className="mb-6">
                  <label htmlFor="upload-button" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-light-teal rounded-xl bg-mint-cream hover:bg-pale-teal transition-colors">
                      <UploadCloud className="w-8 h-8 text-teal-green mb-2" />
                      <span className="text-sea-green font-medium">Click to upload</span>
                      <p className="text-sm text-grayish-teal mt-1">
                        PNG, JPG, GIF (Max 5 images)
                      </p>
                    </div>
                  </label>
                  <Input
                    id="upload-button"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                    className="hidden"
                  />
                  <ErrorMessage name="images">
                    {(msg) => <div className="text-red-500 text-sm mt-2">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-forest-green mb-3">
                      Selected Images ({images.length}/5)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview}
                            alt={`preview-${index}`}
                            className="w-full h-32 object-cover rounded-lg border border-pale-teal"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, setFieldValue)}
                            className="absolute top-2 right-2 bg-sea-green text-off-white rounded-full p-1 hover:bg-teal-green transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Textarea */}
                <div className="mb-6">
                  <Field
                    as={Textarea}
                    name="message"
                    placeholder="Describe your design idea in detail..."
                    className="min-h-[120px] bg-mint-cream border-light-teal focus:border-sea-green focus:ring-sea-green text-dark-green"
                  />
                  <ErrorMessage name="message">
                    {(msg) => <div className="text-red-500 text-sm mt-2">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-sea-green hover:bg-teal-green text-off-white font-semibold py-3 transition-colors"
                >
                  Submit Custom Order
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCustomOrder;