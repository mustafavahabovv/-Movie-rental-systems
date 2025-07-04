import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { persistor, store } from "./redux/store/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import './i18n/i18n.js';


// Yeni əlavə: ThemeProvider
import { ThemeProvider } from "./context/ThemeContext.jsx"; // ✅ Əlavə olundu

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider> {/* ✅ Dark Mode üçün əlavə */}
        <ToastContainer position="top-right" autoClose={2000} />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
