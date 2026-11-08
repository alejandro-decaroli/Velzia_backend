![Logo](https://github.com/user-attachments/assets/29c85e36-fe28-496c-8b20-be96fd504f4f)


# Velzia

Velzia es una herramienta para registrar ventas, pedidos, pagos, cobros, transferencias y entidades de un negocio pequeño, a fin de:

    Auditar los registros para tener una trazabilidad del flujo de dinero del negocio.
    Tener datos con los cuales analizar, y extraer información valiosa para el dueño del negocio.





## Autores

- [@alejandro-decaroli](https://github.com/alejandro-decaroli)
- [@GonzaloZN](https://github.com/GonzaloZN)


## Requisitos para uso local

Es necesario tener instalado [docker](https://www.docker.com/) y [docker compose](https://docs.docker.com/compose/).


    
## Ejecutar en local

Clonar el proyecto

```bash
  git clone https://github.com/alejandro-decaroli/Velzia_backend.git
```

Ir a la raiz del proyecto

```bash
  cd Velzia_backend
```

Crear un archivo `.env` en la raíz del proyecto y escribir las variables de entorno que se proporcionan debajo.

```bash
  touch .env
``` 

### Variables de entorno

```
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=velzia_db
DATABASE_URL=postgres://postgres:postgres@localhost:5433/velzia_db
PORT=3000
NODE_ENV=development
SECRET_KEY=esta-es-una-clave-secreta-muy-larga
FRONTEND_URL=http://localhost:5173
START_SEEDERS=true
```

Ahora desde docker_compose.yaml levantar primero la base datos y luego el backend.

O en la terminal ejecutar:
```
docker-compose -f docker_compose.yaml up db
docker-compose -f docker_compose.yaml up app
``` 

Tambien pueden levantar el backend por terminal, pero primero es necesario instalar las dependencias.

```bash
  npm install
```
Luego levanten con docker unicamente la base de datos postgres como se menciono previamente.

Posteriormente en terminal ejecutar:

```bash
  npm run start:dev
```

Si quieren que se ejecuten los seeders al iniciar la app, deben agregar la variable de entorno START_SEEDERS=true, sino dejar en false.


## Ejecutar Tests

Los tests automatizados están implementados con **Jest** y **ts-jest** (6 suites de pruebas y 18 tests en total). Para ejecutarlos:

```bash
# Ejecutar toda la suite de pruebas (18 tests)
npm test

# Ejecutar únicamente los tests unitarios (10 tests)
npm test -- tests/unit

# Ejecutar únicamente los tests integradores (8 tests)
npm test -- tests/integration
```

### ¿Qué prueban los tests?

* **Tests Unitarios (`tests/unit/`):**
  * **Validaciones (`validations.test.ts`):** Evalúa el middleware de validación (`ventaValidation` y `handleValidationErrors`), comprobando que responda con `400 Bad Request` y la lista de errores ante datos ausentes o inválidos, o llame a `next()` si los datos son correctos.
  * **Manejo y Devolución de Errores (`errorHandling.test.ts`):** Evalúa el controlador (`ventaController`) en aislamiento simulando fallos en el servicio, comprobando la devolución adecuada de códigos HTTP (`404 Not Found`, `400 Bad Request` y `500 Internal Server Error`).
  * **Validación de Productos y Costos (`productoValidation.test.ts`):** Valida que el `costo_actual` de un producto deba ser estrictamente menor a su `precio_venta` (`400 Bad Request` si es mayor o igual), comprueba la sincronización de precios y cálculo de subtotales en las entidades `Producto`, `LineaVenta` y `LineaPedido`, y evalúa la validación de formato del endpoint de importación masiva (`bulkCreate`) en `productoController`.

* **Tests Integradores (`tests/integration/`):**
  * **Creación de Venta (`ventaCreacion.test.ts`):** Comprueba la interacción entre las clases `Usuario`, `Cliente` y `Venta`, validando la asignación de relaciones, generación de código secuencial (`VEN_1`, `VEN_2`), inicialización en estado `'Pendiente'` con total `0`, y persistencia.
  * **Registro de Línea de Venta (`ventaDetalle.test.ts`):** Comprueba la interacción multidominio entre `Venta`, `Producto` y `LineaVenta`, verificando la sincronización atómica: descuento del stock físico del producto, incremento del total en la venta con cálculo de descuentos, y validación de reglas de negocio como stock insuficiente (`409 Conflict`).
  * **Seeder de Movimientos Financieros (`movimientoSeeder.test.ts`):** Comprueba la generación e inserción coordinada de movimientos financieros (`MovF`) a partir de ventas, pedidos y costos en estado pagado, verificando la clasificación de flujo (`'Ingreso'` vs `'Egreso'`), vinculación a la caja y correlatividad de códigos secuenciales (`PA_1`, `PA_2`).


## Documentación

La aplicacion completa se encuentra desplegada en https://render.com/.

El backend: https://velzia-backend.onrender.com/

El frontend: https://velzia-frontend.onrender.com/

Las instancias se encuentran "dormidas" por ende es necesario esperar a que "despierten" para poder utilizar la app, solo entren a los enlaces y esperen a que ambos carguen correctamente.

## Documentación de la API

Puedes consultar la documentación completa de la API [aquí](src/docs/api.md).

## Video demostración

Enlace al video: https://drive.google.com/file/d/1K-A6cGTddqLqrD3fay0Tg4iFZyRbmp0u/view?usp=drive_link

## Tech Stack
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
