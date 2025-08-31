## Preparación del Backend

### Requisitos previos 

  * Docker 28.0.1 o superior

### Instalación

  1. Clonar el repositorio
  2. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables (consultar con un administrador el valor de dichas variables):


```js
PORT =
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
GOOGLE_REDIRECT_URI=

ADMIN_EMAIL=
ADMIN_PASSWORD=

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=
EXTERNAL_API_USER=
EXTERNAL_API_PASS=
FRONTEND_URL=

```

### Ejecución 

El proyecto cuenta con `DockerFile` y `docker-compose.yml`. Para iniciar el backend ejecutar el siguiente comando:

```docker
sudo docker compose up --build -d
```
