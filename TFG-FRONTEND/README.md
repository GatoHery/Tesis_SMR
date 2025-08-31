## Preparación del Frontend

### Requisitos previo

  * Docker 28.0.1 o superior

### Instalación 

1. Clonar el repositorio
2. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables (consultar con un administrador el valor de dichas variables):

```ts
VITE_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_MICROSOFT_CLIENT_ID=
```

### Ejecución 

El proyecto cuenta con `DockerFile` y `docker-compose.yml`. Para iniciar el frontend, ejecutar:

```docker
sudo docker compose up --build -d
```
