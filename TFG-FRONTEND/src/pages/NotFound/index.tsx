// src/pages/NotFound.tsx
import { Button, Result, theme } from 'antd';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgLayout,
        color: token.colorText,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que buscas no existe."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
