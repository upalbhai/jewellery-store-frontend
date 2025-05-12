import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={queryClient}>

    <App />
    </QueryClientProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
