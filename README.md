# RomaForte Web

Portal de gestión comercial para Importadora Romaforte, construido con React y Vite. Incluye resumen operativo, ventas, inventario, compras, clientes, reportes y configuración.

## Acceso

- Usuario: jhon.mayta@romaforte.bo
- Contraseña: romaforte123

La información inicial está preconfigurada en la aplicación y los cambios se guardan en el navegador.

## Desarrollo

    npm ci
    npm run dev

Para generar los archivos de producción:

    npm run build

## Docker

Construye y ejecuta el sitio con Docker:

    docker build -t romaforte-web .
    docker run --rm -p 8080:80 romaforte-web

Abre http://localhost:8080.

## Publicación en Docker Hub con GitHub Actions

1. Crea el repositorio romaforte-web en Docker Hub.
2. En GitHub, abre Settings → Secrets and variables → Actions.
3. Agrega la variable DOCKERHUB_USERNAME con tu usuario de Docker Hub.
4. Agrega el secreto DOCKERHUB_TOKEN con un access token de Docker Hub que tenga permiso de lectura y escritura.
5. Envía cambios a la rama main o publica una etiqueta v*. El workflow construirá y publicará la imagen como USUARIO/romaforte-web, con etiquetas de rama, versión, SHA corto y latest en la rama predeterminada.

También puedes iniciar el workflow manualmente desde la pestaña Actions.