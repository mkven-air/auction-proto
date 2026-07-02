import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "./locale";
import "@auction/web-shared/index.css";
import { PassengerBidUI } from "./pages/PassengerBidUI";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <PassengerBidUI />
      </LocaleProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
