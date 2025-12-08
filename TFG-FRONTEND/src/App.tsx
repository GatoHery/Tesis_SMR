// ** React Imports
import { useEffect } from "react";

// ** Third Party Immports
import { ConfigProvider, theme } from "antd";
import { useNavigate } from "react-router-dom";

// ** Router Imports
import Router from "@/routes/router";

// ** Zustand Store Imports
import useThemeStore from "@/store/theme.store";
import useAuthStore from "@/store/auth.store";
import { ToastContainer } from "react-toastify";

// ** Utils Imports
import { getCookie } from "./utils/cookies";

function App() {
  const { darkMode } = useThemeStore();
  const { whoami} = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");


    if(token === null ) navigate("/login", { replace: true });
    //Comentario de prueba
    
  }, [whoami]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0064bd",
          colorBgContainer: darkMode ? "#26272e" : "#ffffff",
          colorBgLayout: darkMode ? "#17191a" : "#fafafa",
        },
      }}
    >
      <Router />
      <ToastContainer />
    </ConfigProvider>
  );
}

export default App;
