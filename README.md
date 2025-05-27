
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


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




## API Reference

### Obtener todos los ajustes
```http
GET http://localhost:3000/ajustes
```

### Obtener ajuste por ID
```http
GET http://localhost:3000/ajustes/1
```

### Crear ajuste
```http
POST http://localhost:3000/ajustes/create
Content-Type: application/json

{
  "caja_id": 1,
  "monto": 100.00,
  "movimiento": "Negativo"
}
```

### Actualizar ajuste
```http
PUT http://localhost:3000/ajustes/update/1
Content-Type: application/json

{
  "caja_id": 1,
  "monto": 100.00,
  "movimiento": "Negativo"
}
```

### Eliminar ajuste
```http
DELETE http://localhost:3000/ajustes/delete/1
```

### Obtener todos los aportes
```http
GET http://localhost:3000/aportes_socio
```

### Obtener aporte por ID
```http
GET http://localhost:3000/aportes_socio/1
```

### Crear aporte
```http
POST http://localhost:3000/aportes_socio/create
Content-Type: application/json

{
  "caja_id": 1,
  "monto": 100
}
```

### Actualizar aporte
```http
PUT http://localhost:3000/aportes_socio/update/1
Content-Type: application/json

{
  "caja_id": 1,
  "monto": 100
}
```

### Eliminar aporte
```http
DELETE http://localhost:3000/aportes_socio/delete/1
```

### Obtener todos los cajas
```http
GET http://localhost:3000/cajas
```

### Obtener caja por ID
```http
GET http://localhost:3000/cajas/2
```

### Crear caja
```http
POST http://localhost:3000/cajas/create
Content-Type: application/json

{
  "nombre": "GZCaja",
  "tipo": "Pesos"
}
```

### Actualizar caja
```http
PUT http://localhost:3000/cajas/update/1
Content-Type: application/json

{
  "nombre": "caja Actualizado",
  "tipo": "CA"
}
```

### Eliminar caja
```http
DELETE http://localhost:3000/cajas/delete/10
```

### Obtener todos los clientes
```http
GET http://localhost:3000/clientes
```

### Obtener cliente por ID
```http
GET http://localhost:3000/clientes/5.5
```

### Crear cliente
```http
POST http://localhost:3000/clientes/create
Content-Type: application/json

{
  "nombre": "Ailen",
  "siglas": "AI",
  "estado": "Activo"
}
```
### Actualizar cliente
```http
PUT http://localhost:3000/clientes/update/8
Content-Type: application/json

{
  "nombre": "Marina",
  "siglas": "A",
  "estado": "terminado"
}
```

### Eliminar cliente
```http
DELETE http://localhost:3000/clientes/delete/7
```

### Obtener todos los costos fijos
```http
GET http://localhost:3000/costos_fijos
```

### Obtener cliente por ID
```http
GET http://localhost:3000/costos_fijos/1
```

### Crear cliente
```http
POST http://localhost:3000/costos_fijos/create
Content-Type: application/json

{
  "caja_id": 1,
  "adjudicacion": "NC",
  "monto": 100
}
```

### Actualizar cliente
```http
PUT http://localhost:3000/costos_fijos/update/5
Content-Type: application/json

{
  "caja_id": 2,
  "adjudicacion": "Cliente Actualizado",
  "monto": 200
}
```

### Eliminar cliente
```http
DELETE http://localhost:3000/costos_fijos/delete/5
```

### Obtener todos los costos variables
```http
GET http://localhost:3000/costos_variables
```

### Obtener costo variable por ID
```http
GET http://localhost:3000/costos_variables/1
```

### Crear costo variable
```http
POST http://localhost:3000/costos_variables/create
Content-Type: application/json

{
  "caja_id": 1,
  "cliente_id": 1,
  "adjudicacion": "Adjudicacion",
  "monto": 100
}
```

### Actualizar costo variable
```http
PUT http://localhost:3000/costos_variables/update/1
Content-Type: application/json

{
  "caja_id": 1,
  "cliente_id": 1,
  "adjudicacion": "Adjudicacion",
  "monto": 200
}
```

### Eliminar costo variable
```http
DELETE http://localhost:3000/costos_variables/delete/1
```

### Obtener todos los dividendos
```http
GET http://localhost:3000/dividendos_socio
```

### Obtener dividendo por ID
```http
GET http://localhost:3000/dividendos_socio/1
```

### Crear dividendo
```http
POST http://localhost:3000/dividendos_socio/create
Content-Type: application/json

{
  "caja_id": 1,
  "monto": 100
}
```

### Actualizar dividendo
```http
PUT http://localhost:3000/dividendos_socio/update/1
Content-Type: application/json

{
  "caja_id": 1,
  "monto": 100
}
```

### Eliminar dividendo
```http
DELETE http://localhost:3000/dividendos_socio/delete/1
```

### Obtener todos los pagos
```http
GET http://localhost:3000/pagos
```

### Obtener pago por ID
```http
GET http://localhost:3000/pagos/1
```

### Crear pago
```http
POST http://localhost:3000/pagos/create
Content-Type: application/json

{
  "cliente_id": 1,
  "caja_id": 2,
  "monto": 300.0
}
```

### Actualizar pago
```http
PUT http://localhost:3000/pagos/update/1
Content-Type: application/json

{
  "nombre": "pago Actualizado",
  "siglas": "CA",
  "estado": "Activo"
}
```

### Eliminar pago
```http
DELETE http://localhost:3000/pagos/delete/1
```

### Obtener todos las tasas
```http
GET http://localhost:3000/tasas
```

### Obtener tasa por ID
```http
GET http://localhost:3000/tasas/1
```

### Crear tasa
```http
POST http://localhost:3000/tasas/create
Content-Type: application/json

{
  "tasa_actual": 1.0,
  "tasa_nueva": 2.0
}
```

### Actualizar tasa
```http
PUT http://localhost:3000/tasas/update/1
Content-Type: application/json

{
  "tasa_actual": 1.0,
  "tasa_nueva": 3.0
}
```

### Eliminar tasa
```http
DELETE http://localhost:3000/tasas/delete/1
```

### Obtener todos las transferencias
```http
GET http://localhost:3000/transferencias
```

### Obtener transferencia por ID
```http
GET http://localhost:3000/transferencias/1
```

### Crear transferencia
```http
POST http://localhost:3000/transferencias/create
Content-Type: application/json

{
  "caja_origen_id": 1,
  "caja_destino_id": 22,
  "monto": 1000
}
```

### Actualizar transferencia
```http
PUT http://localhost:3000/transferencias/update/1
Content-Type: application/json

{
  "caja_origen_id": 2,
  "caja_destino_id": 1,
  "monto": 1000
}
```

### Eliminar transferencia
```http
DELETE http://localhost:3000/transferencias/delete/2
```

### Obtener todos las ventas
```http
GET http://localhost:3000/ventas
```

### Obtener venta por ID
```http
GET http://localhost:3000/ventas/1
```

### Crear venta
```http
POST http://localhost:3000/ventas/create
Content-Type: application/json

{
  "cliente_id": 1,
  "monto_ars": 1000,
  "costo_mano_obra": 100,
  "costo_materiales_viaticos_fletes": 50,
  "costo_comision": 20,
  "monto_usd": "1000.00"
}
```

### Actualizar venta
```http
PUT http://localhost:3000/ventas/update/1
Content-Type: application/json

{
  "cliente_id": 10,
  "monto_ars": 1000,
  "costo_mano_obra": 100,
  "costo_materiales_viaticos_fletes": 50,
  "costo_comision": 20,
  "monto_usd": "1000.00"
}
```

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
