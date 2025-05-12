import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';
import SocketManager from './components/SocketProvider';

function App() {
  return (
    <>
    <SocketManager/>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
    </>
  );
}

export default App;
