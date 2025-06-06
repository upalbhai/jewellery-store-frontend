// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import settingReducer from './features/settings/settingSlice';
import notificationReducer from './features/notifications/notificationSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage

const persistConfig = {
  key: 'auth',
  storage,
};
const notificationPersistConfig = {
  key: 'notification',
  storage,
};
const settingPersistConfig = {
  key: 'settings',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedSettingsReducer = persistReducer(settingPersistConfig, settingReducer);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, notificationReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notifications:persistedNotificationReducer,
    settings:persistedSettingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
