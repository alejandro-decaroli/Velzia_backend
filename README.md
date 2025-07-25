![Logo](https://github.com/user-attachments/assets/29c85e36-fe28-496c-8b20-be96fd504f4f)


# Velzia

Velzia es un mini ERP para pequeñas empresas, diseñado para ser simple y práctico.




## Autores

- [@alejandro-decaroli](https://github.com/alejandro-decaroli)
- [@GonzaloZN](https://github.com/GonzaloZN)


## Requisitos para uso local

Es necesario tener instalado [docker](https://www.docker.com/) para levantar la base de datos. Elegir el método de instalación según el sistema operativo que se utiliza



    
## Ejecutar en local

Clonar el proyecto

```bash
  git clone https://github.com/alejandro-decaroli/Velzia_backend.git
```

Ir a la raiz del proyecto

```bash
  cd Velzia_backend
```

Install dependencies

```bash
  npm install
```

Crear un archivo .env y escribir las variables de entorno que se proporcionan en el REEDME.

```bash
  cd src
  touch .env
```

Luego es necesario levantar la base de datos con docker para esto inicie docker en el sistema, y en el archivo de docker_compose.yaml haga click derecho y selecione "compose up". Esto levanta la base de datos, genera datos sinseticos para usar la app y levanta el servidor.
Opcionalmente puede levantar unciamente el servicio de la base de datos y flyway para iniciar el servidor con:

```bash
  npm run start:dev
```


## Variables de entorno

En un archivo .env es necesario declarar la variable de entorno
```
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=velzia_db
DATABASE_URL=postgres://postgres:postgres@localhost:5433/velzia_db
PORT=3000

```


## Ejecutar Tests

Ejecutar el siguiente comando:

```
  npm run start:tests
```


## Documentación


### Eliminar venta
```http
DELETE http://localhost:3000/ventas/delete/1
```
## Tech Stack
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
