import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import './styles.css';

// One shared QueryClient for the whole app — it's the in-memory cache
// TanStack Query uses to store fetched data, keyed by the queryKey each
// useQuery call is given (e.g. ['admin-players']). Any component using
// the same key shares the same cached data instead of each page fetching
// independently.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
