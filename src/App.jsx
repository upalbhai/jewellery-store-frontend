import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';
import SocketManager from './components/SocketProvider';
import { setIsMobile } from './features/settings/settingSlice';
import useMobileDetector from './hooks/useMobileDetector';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const AppWrapper = () => {
  const dispatch = useDispatch();
  const isMobile = useMobileDetector();

  // update Redux on load
  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

  return (
    <>
      <SocketManager />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AppWrapper />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
