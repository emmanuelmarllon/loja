import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// React Router
import { BrowserRouter } from "react-router-dom";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Contextos globais
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { CartModalProvider } from "./context/CartModalContext";

// Cria o client do React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <CartModalProvider>
              <App />
            </CartModalProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
