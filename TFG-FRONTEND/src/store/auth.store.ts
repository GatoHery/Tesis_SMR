import { authService } from '@/services/auth.service';
import { AuthUser } from "@/types/auth.type";
import { getCookie, removeCookie, setCookie } from '@/utils/cookies';
import { toast } from 'react-toastify';
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  OAuthGooglelogin: (authorizationCode: string) => void;
  OAuthMicrosoftlogin: () => void;
  logout: () => void;
  whoami: () => void;
  setError: (error: string | null) => void;
}

const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    token: null,
    error: null,
    isAuthenticated: null,
    loading: false,

    OAuthGooglelogin: async (authorizationCode) => {
      try {
        set({ loading: true });
        const data = await authService.loginWithGoogle(authorizationCode);

        const { user, token } = data;
        const formattedUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name
        };

        setCookie("token", token);
        setCookie("user", JSON.stringify(formattedUser));

        set({
          user: formattedUser,
          token,
          isAuthenticated: true,
          loading: false,
        });

      } catch (error) {
        toast.error("Error al iniciar sesión. Contacta al administrador.");
        console.error("Error during Google login: ", error);
        set({ error: "Google login failed", loading: false });
      }
    },

    OAuthMicrosoftlogin: async () => {
      try {
        // set({ loading: true });
        const { token, user } = await authService.loginWithMicrosoft();

        const formattedUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name
        };

        console.log("Microsoft login data: ", JSON.stringify(user));
        setCookie("token", token);
        setCookie("user", JSON.stringify(user));

        set({
          user: formattedUser,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        toast.error("Error al iniciar sesión. Contacta al administrador");
        console.error("Error during Microsoft login: ", error);
        set({ error: "Microsoft login failed", loading: false });
      }
    },

    logout: () => {
      set({ loading: true });
      removeCookie("token");
      removeCookie("user");
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    },

    whoami: async () => {
      try {
        set({ loading: true });
        const data = await authService.whoami();

        const user = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role.name,
        }

        setCookie("user", JSON.stringify(user));
        set({
          user,
          token: getCookie("token"),
          isAuthenticated: true,
          loading: false,
        });

      } catch (error) {
        console.error("Error loading token: ", error);
        removeCookie("token");
        removeCookie("user");
        set({ user: null, token: null, isAuthenticated: false, loading: false });
      }
    },

    setError: (error) => {
      set({ error });
    },
  }),
);

export default useAuthStore;
