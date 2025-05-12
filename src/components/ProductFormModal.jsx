import React, { useState, useEffect } from "react";
import StylishLoader from "./StylishLoader";
import { addproduct, editProduct } from "@/core/requests";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

const ProductFormModal = ({ open, onClose, getProducts, isEdit = false, productData = {} }) => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [deselectedImages, setDeselectedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    stockQuantity: "",
    isAvailable: true,
  });

  // Initialize form data when productData changes
  useEffect(() => {
    if (isEdit && productData) {
      setFormData({
        name: productData.name || "",
        category: productData.category || "",
        subCategory: productData.subCategory || "",
        description: productData.description || "",
        price: productData.price || "",
        stockQuantity: productData.stockQuantity || "",
        isAvailable: productData.isAvailable !== false,
      });
      if (productData.images) {
        setCurrentImages(productData.images);
      }
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        category: "",
        subCategory: "",
        description: "",
        price: "",
        stockQuantity: "",
        isAvailable: true,
      });
      setCurrentImages([]);
    }
    setImageFiles([]);
    setPreviewImages([]);
    setDeselectedImages([]);
  }, [isEdit, productData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index, isCurrent = false, src) => {
    if (isCurrent && src) {
      setDeselectedImages(prev => [...prev, src]);
      setCurrentImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from preview and files
      const updatedFiles = [...imageFiles];
      updatedFiles.splice(index, 1);
      setImageFiles(updatedFiles);
      
      const updatedPreviews = [...previewImages];
      URL.revokeObjectURL(updatedPreviews[index]); // Clean up memory
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataPayload = new FormData(); 
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataPayload.append(key, value);
      });
      
      // Append new images
      imageFiles.forEach(file => {
        formDataPayload.append('images', file);
      });
      
      // For edit, include product ID and deleted images
      if (isEdit) {
        formDataPayload.append('_id', productData._id);
        if (deselectedImages.length > 0) {
          formDataPayload.append('deletedImages', JSON.stringify(deselectedImages));
        }
      }
      
      const response = isEdit 
        ? await editProduct(formDataPayload)
        : await addproduct(formDataPayload);
      
      if (response.meta?.success) {
        toast.success(response.meta.message || (isEdit ? "Product updated successfully" : "Product added successfully"));
        getProducts({ page: 1 }); // Refresh products list
        onClose();
        setFormData({
            name: "",
            category: "",
            subCategory: "",
            description: "",
            price: "",
            stockQuantity: "",
            isAvailable: true,
          });
          setImageFiles([]);
    setPreviewImages([]);
    setDeselectedImages([]);

      } else {
        throw new Error(response.meta?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <StylishLoader />
        </DialogContent>
      </Dialog>
    );
  }

  return (
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-h-[90vh] w-[95vw] sm:max-w-[625px] bg-pale-teal border-2 border-pale-teal rounded-lg shadow-lg overflow-y-auto">
    <DialogHeader className="sticky top-0 bg-pale-teal w-1/2 z-10 py-2 border-b border-pale-teal">
      <DialogTitle className="text-xl sm:text-2xl font-bold text-deep-green">
        {isEdit ? "Edit Product" : "Add Product"}
      </DialogTitle>
    </DialogHeader>
    
    <DialogDescription>
  Fill in the product details below.
    </DialogDescription>
    <form onSubmit={handleSubmit} className="space-y-4 px-1 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-deep-green font-medium">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="bg-off-white border-sea-green focus:ring-teal-green focus:border-teal-green w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-deep-green font-medium">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="bg-off-white border-sea-green focus:ring-teal-green focus:border-teal-green w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subCategory" className="text-deep-green font-medium">Sub-Category</Label>
          <Input
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            required
            className="bg-off-white border-sea-green focus:ring-teal-green focus:border-teal-green w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price" className="text-deep-green font-medium">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="bg-off-white border-sea-green focus:ring-teal-green focus:border-teal-green w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-deep-green font-medium">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          required
          className="w-full p-2 border border-sea-green rounded-md bg-off-white focus:ring-teal-green focus:border-teal-green"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stockQuantity" className="text-deep-green font-medium">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            required
            min="0"
            className="bg-off-white border-sea-green focus:ring-teal-green focus:border-teal-green w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2 self-end pb-2">
          <Checkbox
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, isAvailable: checked }))
            }
            className="h-5 w-5 border-sea-green data-[state=checked]:bg-teal-green"
          />
          <Label htmlFor="isAvailable" className="text-deep-green font-medium">Available</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-deep-green font-medium">Images</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-green file:text-stark-white-50 hover:file:bg-sea-green w-full"
        />
        
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
          {currentImages.map((src, index) => (
            <div key={`current-${index}`} className="relative group">
              <img
                src={`${import.meta.env.VITE_API_URL}/${src}`}
                alt={`Product ${index}`}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border-2 border-pale-teal"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index, true, src)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-xs sm:text-base cursor-pointer"
              >
                X
              </button>
            </div>
          ))}
          {previewImages.map((src, index) => (
            <div key={`preview-${index}`} className="relative group">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border-2 border-pale-teal"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-xs sm:text-base"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="sticky bottom-0 bg-pale-teal pt-4 pb-2 border-t border-pale-teal">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            type="button" 
            variant="outline" 
            onClick={()=>{
                onClose();
                
            }}
            className="text-deep-green border-deep-green hover:bg-mint-cream hover:text-deep-green w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-teal-green hover:bg-sea-green text-stark-white-50 w-full sm:w-auto"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
  );
};

export default ProductFormModal;