import api from '@/api/axiosInstance';

const AUTH_PATH = '/api/auth';

type UserMicrosoft = {
  id: string,
  name: string,
  email: string,
  role: {
    name: string,
    createdAt: string,
    updatedAt: string,
    uid: string
  }
}

export const authService = {
  loginWithGoogle: async (authorizationCode: string) => {
    const res = await api.post(`${AUTH_PATH}/google`, {
      code: authorizationCode,
    });

    return res.data;
  },

  loginWithMicrosoft: async () => {
    const popup = window.open(
      'http://localhost:5050/api/auth/microsoft',
      'targetWindow',
      `toolbar=no,
        location=no,
        status=no, 
        menubar=no,
        scrollbars=yes, 
        resizable=yes,
        width=620,
        height=700,
      `
    );

    if (!popup) throw new Error("No se pudo abrir la ventana emergente");

    return new Promise<{ token: string, user: UserMicrosoft }>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (
          event.origin === "http://localhost:5050" &&
          event.data?.token
        ) {
          popup.close();
          window.removeEventListener("message", handleMessage);
          resolve({ token: event.data.token, user: event.data.user });
        }
      };

      window.addEventListener("message", handleMessage);

      // Opcional: timeout por si el usuario cierra la ventana
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Microsoft login timeout or canceled"));
      }, 60 * 1000); // 1 minuto
    });
  },

  loginWithCredentials: async (email: string, password: string) => {
    const res = await api.post(`${AUTH_PATH}/login`, {
      email,
      password,
    });

    return res.data;
  },

  whoami: async () => {
    const res = await api.get(`${AUTH_PATH}/whoami`, { withCredentials: true });

    return res.data;
  }

};
