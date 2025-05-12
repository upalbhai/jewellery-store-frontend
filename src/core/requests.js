import axios from "axios";
import { BASE_URL, ORDERS, PRODUCT, REVIEW, USER } from "./consts";
import api from "./api";
import socket from "./socket";

export const getCategories = async()=>{
    const response = await axios.get(`${BASE_URL}${PRODUCT.GET_CATEGORIES}`);
    return response.data;
}

export const getProducts = async (params) => {
    try {
      const response = await axios.get(`${BASE_URL}${PRODUCT.GET_PRODUCTS}`, {
        withCredentials: true,
        params: {
          ...params,
          page: params.page || 1, // Default to page 1 if not provided
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getProducts API:", error);
      throw error;
    }
  };

  export const deleteProduct = async(id)=>{
    const response= await api.delete(`${BASE_URL}${PRODUCT.PRODUCT}`,{
        withCredentials:true,
        data: { id }, 
    })
    return response.data;
  }

  export const getProductById = async(id)=>{
    const response = await axios.post(`${BASE_URL}${PRODUCT.PRODUCT_BY_ID}`,{
        id,
    },{
        withCredentials:true
    })
    return response.data;
  }

  export const getAllOrdersForAdmin = async (reqObj) => {
    const response = await api.get(`${BASE_URL}${ORDERS.ORDERS}`, {
      params: { ...reqObj },
      withCredentials: true,
    });
    return response.data;
  };

  export const addproduct = async(reqObj)=>{
    const response = await api.post(`${BASE_URL}${PRODUCT.PRODUCT}`,reqObj,{
        withCredentials:true
    });
    return response.data;
}
export const editProduct = async(reqObj)=>{
    const response = await api.put(`${BASE_URL}${PRODUCT.PRODUCT}`,reqObj,{
        withCredentials:true
    });
    return response.data;
}

export const addProductDiscount = async ({ id, discount }) => {
  const response = await api.post(`${BASE_URL}${PRODUCT.ADD_DISCOUNT}`, {
    id,
    discount,
  }, { withCredentials: true });
  return response.data;
};

export const removeProductDiscount = async ({ id }) => {
  const response = await api.post(`${BASE_URL}${PRODUCT.REMOVE_DISCOUNT}`, {
    id,
  }, { withCredentials: true });
  return response.data;
};

export const fetchUsers = async (params) => {
  const res = await api.get(`${BASE_URL}${USER.GET_ALL_USERS}`, {
    params,
    withCredentials:true
  });
  return res.data;
};

export const updatePremiumStatus = async(id, isPremium, discount)=>{
  const response = await api.post(`${BASE_URL}${USER.PREMIUM_USER}`, {
    id,
    isPremium,
    discount,
  },{
    withCredentials:true
  });
  return response.data; // Return the response data
}

export const getUserByIdForAdmin = async(id)=>{
  const response = await api.get(`${BASE_URL}${USER.GET_ALL_USERS}/${id}`,{
    withCredentials:true
  });
  return response.data
}

export const getFeaturePost = async()=>{
  const response = await axios.get(`${BASE_URL}${PRODUCT.FEATURE_PRODUCT}`);
  return response.data
}

export const addToCart = async(productId)=>{
  const response = await axios.post(`${BASE_URL}${USER.CART}`,{
      productId,
  },{
      withCredentials:true
  })
  return response.data;
}


export const getCartItems=async ()=>{
  const response = await api.get(`${BASE_URL}${USER.CART}`,{
      withCredentials:true
  });
  return response.data;
}

export const removeCartItems = async(productId)=>{
  const response = await api.delete(`${BASE_URL}${USER.CART}`,{
      data:{productId},
      withCredentials:true
  })
  return response.data
}

export const createReview = async(review,productId)=>{
  const response = await axios.post(`${BASE_URL}${REVIEW.REVIEWS}`,{
      ...review,
      productId
  },{
      withCredentials:true
  })
  return response.data;
}

export const getAllReviews = async(id,page,limit)=>{
  const response = await axios.post(`${BASE_URL}${REVIEW.ALL_REVIEWS}`,{
      productId:id,
  },
  {
      params: { page, limit },
      withCredentials: true,
    }
)
return response.data;
}

export const editReview = async (body)=>{
  const response = await axios.put(`${BASE_URL}${REVIEW.REVIEWS}`,{
      ...body, 
  }, {withCredentials: true,});
  return response.data;
}

export   const deleteReview = async (id,productId)=>{
  const response = await axios.delete(
      `${BASE_URL}${REVIEW.REVIEWS}`,
      {
        data: {
          reviewId: id,
          productId
        },
        withCredentials: true,
      }
    );
  return response?.data;
}


export const getProfile = async()=>{
  const response = await api.get(`${BASE_URL}${USER.PROFILE}`,{
      withCredentials:true,
  });
  return response.data;
}

export const editProfile = async(data)=>{
  const response = await api.put(`${BASE_URL}${USER.PROFILE}`,data,{
      withCredentials:true,
  });
  return response.data
}

export const getAddress = async()=>{
  const response = await api.get(`${BASE_URL}${USER.ADDRESS}`,{
      withCredentials:true,
  })
  return response.data
}

export const updateAddress = async(data)=>{
  const response = await api.put(`${BASE_URL}${USER.ADDRESS}`,{...data},{withCredentials:true})
  return response.data
}


// Correct way to use axios with query params:
export const getOrdersForCustomers = async ({ query }) => {
  const response = await api.get(`${BASE_URL}${USER.ORDERS}`, {
    params: query,
    withCredentials: true,
  });
  return response.data;
};


export const getSuggesstedProduct = async(id)=>{
  const response = await axios.post(`${BASE_URL}${PRODUCT.SUGGESSTED_PRODUCTS}`,{
      id,
  },{
      withCredentials:true
  })
  return response.data;
}

export const getOrderById = async ({ orderId, page = 1, limit = 5 }) => {
  const response = await axios.post(`${BASE_URL}${ORDERS.ORDER_BY_ID}`, {
    orderId,
    page,
    limit,
  },{
    withCredentials:true
  });
  return response.data;
};

export const getOrderByIdForShop = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}${ORDERS.ORDER_BY_ID_ADMIN}/${orderId}`,{
      withCredentials:true
    }); // Adjust URL if needed
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order by ID:", error);
    throw error;
  }
};

export const customOrder = async (formData) => {
  const response = await axios.post(`${BASE_URL}${ORDERS.CUSTOM_ORDERS}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data", // ✅ Required for file uploads
    },
  });

  return response.data;
};


export const sendAdminNotification = async (notifications) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${USER.NOTIFICATION}`,
       notifications ,
      { withCredentials: true }
    );

    if (response.data.meta.success) {
    } else {
      console.warn("Failed to send notifications via API:", response.data.meta.message);
    }
      // socket.emit("sendNotification", notifications);

  } catch (error) {
    console.error("Error sending notifications:", error.response?.data || error.message);
  //   toast.error("Failed to send notifications. Please try again later.");
  }
};


// Add these to your core/requests.js

export const getNotification = async (params = {}) => {
  const response = await api.get(`${BASE_URL}${USER.NOTIFICATION}`, {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      filter: params.filter || 'all'
    },
    withCredentials: true
  });
  return response.data;
};

export const markAsReadNotification = async (notificationId) => {
  const response = await api.patch(
    `${BASE_URL}${USER.MARK_AS_READ}/${notificationId}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const url = notificationId 
    ? `${BASE_URL}${USER.NOTIFICATION}/${notificationId}`
    : `${BASE_URL}${USER.NOTIFICATION}`;
  
  const response = await api.delete(url, { withCredentials: true });
  return response.data;
};

export const marksAsReadAllNotifications = async()=>{
  const response = await api.patch(`${BASE_URL}${USER.MARK_AS_READ_All}`,{
    withCredentials:true
  });
  return response.data
}



// admin custom orders

export const getAllOrders = async (reqObj) => {
  const response = await axios.get(`${BASE_URL}${ORDERS.CUSTOM_ORDERS}`, {
    params: { ...reqObj }, // Send pagination & search params
    withCredentials: true,
  });
  return response.data;
};

export const createOrder = async (orderData) => {

    // Send a POST request to the backend to create an order
    const response = await api.post(`${BASE_URL}${ORDERS.ORDERS}`, orderData, {
      withCredentials:true,
    });
    
    // Return the response data from backend which includes razorpayOrder and order details
    return response.data;
};

export const verifyPayment = async(paymentData)=>{
  const response = await api.post(`${BASE_URL}${ORDERS.VERIFY_PAYMENT}`,paymentData,{
    withCredentials:true,
  });
  return response.data;
}


export const retryOrderPayment = async(orderId)=>{
  const response = await api.get(`${BASE_URL}${ORDERS.RETRY_PAYMENT}/${orderId}`,{
    withCredentials:true
  });
  return response.data;
}
export const downdOrderReceipt = async (orderId) => {
  const response = await api.get(
    `${BASE_URL}${ORDERS.DOWNLOAD_RECEIPT}/${orderId}`,
    {
      responseType: 'arraybuffer',
      withCredentials: true,
    }
  );
  return response.data;
};