'use client';
import React, { useRef, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminSettings, updateAdminSettings } from '@/core/requests';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';
import { IoMdSettings } from "react-icons/io";

const AdminSettings = () => {
  const editor = useRef(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    aboutus: '',
    adminEmail: '',
    number: '',
    socialmedialink: '',
    name: ''
  });

  const [logo, setLogo] = useState(null);
  const [moLogo, setMoLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [moLogoPreview, setMoLogoPreview] = useState('');

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Write your about us content here...',
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', '|',
      'align', '|',
      'link', '|',
      'undo', 'redo', '|',
      'hr', 'table', 'image', '|',
      'fullsize'
    ],
    height: 400
  }), []);

  const { data, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await getAdminSettings();
      const data = res.data;
      setFormData({
        aboutus: data.aboutus || '',
        adminEmail: data.adminEmail || '',
        name: data.name || '',
        contactNumber: data.contactNumber || '',
        socialmedialink: data.socialmedialink?.join(', ') || '',
      });
      setLogoPreview(`${import.meta.env.VITE_API_URL}/uploads/Admin/${data.logo}`);
      setMoLogoPreview(`${import.meta.env.VITE_API_URL}/uploads/Admin/${data.mo_logo}`);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      if (logo) payload.append('logo', logo);
      if (moLogo) payload.append('mo_logo', moLogo);
      return await updateAdminSettings(payload);
    },
    onSuccess: () => {
      toast.success('Admin settings updated successfully!');
      queryClient.invalidateQueries(['adminSettings']);
    },
    onError: () => {
      toast.error('Failed to update admin settings');
    }
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (type === 'logo') {
        setLogo(file);
        setLogoPreview(preview);
      } else {
        setMoLogo(file);
        setMoLogoPreview(preview);
      }
    }
  };

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-off-white shadow-lg rounded-xl border border-mint-cream">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-deep-green mb-2">Admin Settings</h2>
        <p className="text-grayish-teal">Manage your application settings and branding</p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-72 bg-gray-100 rounded-md" />
    <div className="h-6 bg-gray-300 rounded w-1/4" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-32 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
    <div className="h-10 bg-teal-300 rounded w-32" />
  </div>
      ) : (
        <div className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input name="adminEmail" value={formData.adminEmail} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Shop Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>About Us</Label>
            <JoditEditor
              ref={editor}
              value={formData.aboutus}
              config={config}
              onBlur={(newContent) => setFormData(prev => ({ ...prev, aboutus: newContent }))}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="socialmedialink">Social Media Links</Label>
            <Input name="socialmedialink" value={formData.socialmedialink} onChange={handleChange} />
          </div> */}

          {/* Logo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} />
              {logoPreview && <img src={logoPreview} alt="Logo" className="h-32 object-contain" />}
            </div>

            <div className="space-y-3">
              <Label>Mobile Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'mo_logo')} />
              {moLogoPreview && <img src={moLogoPreview} alt="Mobile Logo" className="h-32 object-contain" />}
            </div>
          </div>

          <div className="pt-4">
            <Button className='bg-pale-teal cursor-pointer text-deep-green border border:deep-green' onClick={handleSubmit} disabled={mutation.isLoading}>
              <IoMdSettings className='' />{mutation.isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
