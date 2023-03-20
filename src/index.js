import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import {QueryClient,QueryClientProvider} from "react-query"
import ErrorBoundary from './components/ErrorPage/ErrorPage';
const queryclient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryclient}>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
    </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);


