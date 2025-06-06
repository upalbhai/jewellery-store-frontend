export const BASE_URL=`${import.meta.env.VITE_API_URL}/api/v1`
export const KEY_ID=`${import.meta.env.VITE_RAZORPAY_KEY_ID}`
export const KEY_SECRET=`${import.meta.env.VITE_RAZORPAY_KEY_SECRET}`

export const USER = {
    LOGIN:'/user/login',
    SIGNUP:'/user/sign-up',
    LOGOUT:'/user/logout',
    VERIFY_EMAIL:'/user/verify-email',
    GET_ALL_USERS:'/user/admin',
    RESEND_CODE:'/user/resend-verification-code',
    PREMIUM_USER:'/user/admin/premium-user',
    CART:"/user/cart",
    PROFILE:"/user/profile",
    ADDRESS:"/user/address",
    ORDERS:'/order/user/orders',
    FORGOT_PASSWORD:"/user/forgot-password", 
    RESET_PASSWORD:"/user/reset-password", 
    NOTIFICATION:"/user/notification",
    UNREAD_NOTIFICATIONS:"/user/notification/unread-count",
    MARK_AS_READ:"/user/notification/mark-as-read",
    MARK_AS_READ_All:"/user/notification/mark-as-read-all",
    CONTACT_US:"/user/contact-us"
}

export const PRODUCT={
    GET_CATEGORIES:"/product/get-categories",
    GET_PRODUCTS:"/product/search",
    PRODUCT:"/product",
    GET_PRODUCTS:"/product/search",
    PRODUCT_BY_ID:"/product/product-by-id",
    ADD_DISCOUNT:"/product/discount/add",
    REMOVE_DISCOUNT:"/product/discount/remove",
    FEATURE_PRODUCT:"/product/feature-product",
    SUGGESSTED_PRODUCTS:"/product/suggested-product"

}

export const ORDERS = {
    CUSTOM_ORDERS:"/custom-order",
    ORDERS:"/order",
    ORDER_BY_ID:"/order/order-by-id",
    ORDER_BY_ID_ADMIN:"/order/admin/order-by-id",
    VERIFY_PAYMENT:"/order/verify-payment",
    DOWNLOAD_RECEIPT:"/order/download-receipt",
    RETRY_PAYMENT:"/order/retry"

}

export const REVIEW = {
    PRODUCT_BY_ID:"/product/product-by-id",
    SUGGESSTED_PRODUCTS:"/product/suggested-product",
    CART:"/user/cart",
    REVIEWS:"/review/",
    ALL_REVIEWS:"/review/all"
}

export const DASHBOARD = {
    DASHBOARD_STATS:"/dashboard",
    DASHBOARD_SALES:"/dashboard/sales"
}

export const ADMIN_SETTINGS = {
    GET:"/admin-settings"
}