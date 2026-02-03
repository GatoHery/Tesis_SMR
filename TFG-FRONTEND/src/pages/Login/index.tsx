// ** Third Party Imports
import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  Flex,
  theme,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import { Navigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import ucaLogo from "../../assets/img/uca_blue_mob.png";
// ** Zustand store and components imports
import useAuthStore from "@/store/auth.store";
import FullPageLoader from "@/components/FullPageLoader";

const ButtonCSS: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontWeight: 400,
  padding: "0 24px",
  height: 40,
  width: "100%",
};

const { Title } = Typography;

const Login = () => {
  const {
    OAuthGooglelogin,
    /* OAuthMicrosoftlogin */
    isAuthenticated,
    loading,
  } = useAuthStore();

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      if (codeResponse.code) OAuthGooglelogin(codeResponse.code);
      else console.error("Authorization code is undefined");
    },
    onError: () => {
      toast.error("An error occurred during Google login. Please try again.");
      console.log("An error occurred during login...");
    },
  });

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" replace />
      ) : loading ? (
        <FullPageLoader message="Verifying authentication..." />
      ) : (
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: "#0064bd",
              colorBgContainer: "#ffffff",
              colorBgLayout: "#fafafa",
            },
          }}
        >
          <div className="login-container">
            <Card variant="borderless" style={{ width: 400, padding: 20 }}>
              <Title level={3} style={{ marginBottom: 40 }}>
                Iniciar Sesión
              </Title>

              <Divider />

              <Flex vertical gap={10} justify="center" align="center">
                <Button
                  onClick={() => handleGoogleLogin()}
                  type="default"
                  style={ButtonCSS}
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={{ width: 18, height: 18 }}
                  />
                  Continuar con Google
                </Button>

                <img
                  src={ucaLogo}
                  alt="Universidad Centroamericana"
                  style={{ width: 60, marginBottom: 40, alignSelf: "center" }}
                />
                {/* <Button
                      onClick={() => OAuthMicrosoftlogin()}
                      type="default"
                      style={ButtonCSS}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                        alt="Microsoft"
                        style={{ width: 18, height: 18 }}
                      />
                      Continuar con Microsoft UCA
                    </Button>
                 */}
              </Flex>
            </Card>
          </div>
        </ConfigProvider>
      )}
    </>
  );
};

export default Login;
