## API Reference

### Obtener todos los usuarios
Authorization: Bearer <token>
```http
GET http://localhost:3000/usuarios
```

### Obtener usuario por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/usuarios/1
```

### Crear usuario
Authorization: Bearer <token>
```http
POST http://localhost:3000/usuarios/sign-up
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Perez",
  "contrasenia": "123456",
  "email": "juan.perez@example.com"
}
```

### Iniciar sesión
```http
POST http://localhost:3000/usuarios/login
Content-Type: application/json

{
    "email": "juan.perez@example.com",
    "contrasenia": "123456"
}
```

### Actualizar usuario
Authorization: Bearer <token>
```http
PUT http://localhost:3000/usuarios/update/1
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Perez",
  "contrasenia": "123456",
  "email": "juan.perez@example.com"
}
```

### Eliminar usuario
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/usuarios/delete/1
```

### Obtener todos los ajustes
Authorization: Bearer <token>
```http
GET http://localhost:3000/ajustes
```

### Obtener ajuste por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/ajustes/1
```

### Crear ajuste
Authorization: Bearer <token>
```http
POST http://localhost:3000/ajustes/create
Content-Type: application/json

{
  "caja": 1,
  "monto": 100.00,
  "movimiento": "egreso"
}
```

### Actualizar ajuste
Authorization: Bearer <token>
```http
PUT http://localhost:3000/ajustes/update/1
Content-Type: application/json

{
  "caja": 1,
  "monto": 100.00,
  "movimiento": "egreso"
}
```

### Eliminar ajuste
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/ajustes/delete/1
```

### Obtener todos los aportes
Authorization: Bearer <token>
```http
GET http://localhost:3000/aportes_socio
```

### Obtener aporte por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/aportes_socio/1
```

### Crear aporte
Authorization: Bearer <token>
```http
POST http://localhost:3000/aportes_socio/create
Content-Type: application/json

{
  "caja": 1,
  "monto": 100
}
```

### Actualizar aporte
Authorization: Bearer <token>
```http
PUT http://localhost:3000/aportes_socio/update/1
Content-Type: application/json

{
  "caja": 1,
  "monto": 100
}
```

### Eliminar aporte
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/aportes_socio/delete/1
```

### Obtener todos los cajas
Authorization: Bearer <token>
```http
GET http://localhost:3000/cajas
```

### Obtener caja por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/cajas/2
```

### Crear caja
Authorization: Bearer <token>
```http
POST http://localhost:3000/cajas/create
Content-Type: application/json

{
  "nombre": "GZCaja",
  "moneda": 1,
  "siglas": "GZ",
  "monto": 100
}
```

### Actualizar caja
Authorization: Bearer <token>
```http
PUT http://localhost:3000/cajas/update/1
Content-Type: application/json

{
  "nombre": "caja Actualizado",
  "moneda": 1,
  "siglas": "CA",
  "monto": 100
}
```

### Eliminar caja
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/cajas/delete/10
```

### Obtener todos los clientes
Authorization: Bearer <token>
```http
GET http://localhost:3000/clientes
```

### Obtener cliente por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/clientes/5.5
```

### Crear cliente
Authorization: Bearer <token>
```http
POST http://localhost:3000/clientes/create
Content-Type: application/json

{
  "nombre": "pepe2",
  "apellido": "Apellido",
  "telefono": "12345678",
  "email": "pepe2@gmail.com",
  "direccion": "direccion",
  "siglas": "PP2"
}
```
### Actualizar cliente
Authorization: Bearer <token>
```http
PUT http://localhost:3000/clientes/update/8
Content-Type: application/json

{
  "nombre": "pepe2",
  "apellido": "Apellido",
  "telefono": "12345678",
  "email": "pepe2@gmail.com",
  "direccion": "direccion",
  "siglas": "PP2"
}
```

### Eliminar cliente
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/clientes/delete/7
```

### Obtener todos los costos fijos
Authorization: Bearer <token>
```http
GET http://localhost:3000/costos_fijos
```

### Obtener costos fijos por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/costos_fijos/1
```

### Crear costos fijos
Authorization: Bearer <token>
```http
POST http://localhost:3000/costos_fijos/create
Content-Type: application/json

{
  "caja": 1,
  "adjudicacion": "NC",
  "monto": 100
}
```

### Actualizar costos fijos
Authorization: Bearer <token>
```http
PUT http://localhost:3000/costos_fijos/update/5
Content-Type: application/json

{
  "caja": 2,
  "adjudicacion": "Cliente Actualizado",
  "monto": 200
}
```

### Eliminar costos fijos
```http
DELETE http://localhost:3000/costos_fijos/delete/5
```

### Obtener todos los costos variables
Authorization: Bearer <token>
```http
GET http://localhost:3000/costos_variables
```

### Obtener costo variable por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/costos_variables/1
```

### Crear costo variable
Authorization: Bearer <token>
```http
POST http://localhost:3000/costos_variables/create
Content-Type: application/json

{
  "caja": 1,
  "adjudicacion": "Adjudicacion",
  "monto_real": 100,
  "venta": 1,
  "presupuestado": 100
}
```

### Actualizar costo variable
Authorization: Bearer <token>
```http
PUT http://localhost:3000/costos_variables/update/1
Content-Type: application/json

{
  "caja": 1,
  "adjudicacion": "Adjudicacion",
  "monto_real": 200,
  "venta": 1,
  "presupuestado": 200
}
```

### Eliminar costo variable
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/costos_variables/delete/1
```

### Obtener todos los dividendos
Authorization: Bearer <token>
```http
GET http://localhost:3000/dividendos_socio
```

### Obtener dividendo por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/dividendos_socio/1
```

### Crear dividendo
Authorization: Bearer <token>
```http
POST http://localhost:3000/dividendos_socio/create
Content-Type: application/json

{
  "caja": 1,
  "monto": 100
}
```

### Actualizar dividendo
Authorization: Bearer <token>
```http
PUT http://localhost:3000/dividendos_socio/update/1
Content-Type: application/json

{
  "caja": 1,
  "monto": 100
}
```

### Eliminar dividendo
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/dividendos_socio/delete/1
```

### Obtener todos los pagos
Authorization: Bearer <token>
```http
GET http://localhost:3000/pagos
```

### Obtener pago por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/pagos/1
```

### Crear pago
Authorization: Bearer <token>
```http
POST http://localhost:3000/pagos/create
Content-Type: application/json

{
  "caja": 2,
  "monto": 300.0,
  "venta": 1
}
```

### Actualizar pago
Authorization: Bearer <token>
```http
PUT http://localhost:3000/pagos/update/1
Content-Type: application/json

{
  "caja": 2,
  "monto": 300.0,
  "venta": 1
}
```

### Eliminar pago
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/pagos/delete/1
```

### Obtener todos las tasas
Authorization: Bearer <token>
```http
GET http://localhost:3000/tasas
```

### Obtener tasa por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/tasas/1
```

### Crear tasa
Authorization: Bearer <token>
```http
POST http://localhost:3000/tasas/create
Content-Type: application/json

{
  "moneda_origen": 1,
  "moneda_destino": 2,
  "tasa": 2
}
```

### Actualizar tasa
Authorization: Bearer <token>
```http
PUT http://localhost:3000/tasas/update/1
Content-Type: application/json

{
  "moneda_origen": 1,
  "moneda_destino": 2,
  "tasa": 2
}
```

### Eliminar tasa
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/tasas/delete/1
```

### Obtener todos las transferencias
Authorization: Bearer <token>
```http
GET http://localhost:3000/transferencias
```

### Obtener transferencia por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/transferencias/1
```

### Crear transferencia
Authorization: Bearer <token>
```http
POST http://localhost:3000/transferencias/create
Content-Type: application/json

{
  "caja_origen": 1,
  "caja_destino": 22,
  "monto": 1000
}
```

### Actualizar transferencia
Authorization: Bearer <token>
```http
PUT http://localhost:3000/transferencias/update/1
Content-Type: application/json

{
  "caja_origen": 2,
  "caja_destino": 1,
  "monto": 1000
}
```

### Eliminar transferencia
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/transferencias/delete/2
```

### Obtener todos las ventas
Authorization: Bearer <token>
```http
GET http://localhost:3000/ventas
```

### Obtener venta por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/ventas/1
```

### Crear venta
Authorization: Bearer <token>
```http
POST http://localhost:3000/ventas/create
Content-Type: application/json

{
  "cliente": 1,
  "monto": 1000,
  "moneda": 1
}
```

### Actualizar venta
Authorization: Bearer <token>
```http
PUT http://localhost:3000/ventas/update/1
Content-Type: application/json

{
  "cliente": 10,
  "monto": 1000,
  "moneda": 1
}
```

### Eliminar venta
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/ventas/delete/1
```

### Registrar detalle de venta

POST http://localhost:3000/ventas/registrar_detalle/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "producto": 1,
  "cantidad": 2,
  "precio_unitario": 100,
  "descuento": 25
}

### Pagar venta
POST http://localhost:3000/ventas/pagar/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "caja": 1,
  "monto": 150
}

### Obtener todos los productos
Authorization: Bearer <token>
```http
GET http://localhost:3000/productos
```

### Obtener producto por ID
Authorization: Bearer <token>
```http
GET http://localhost:3000/productos/1
```

### Crear producto
Authorization: Bearer <token>
```http
POST http://localhost:3000/productos/create
Content-Type: application/json

{
  "nombre": "Producto",
  "precio": 100,
  "stock": 10
}
```

### Actualizar producto
Authorization: Bearer <token>
```http
PUT http://localhost:3000/productos/update/1
Content-Type: application/json

{
  "nombre": "Producto",
  "precio": 100,
  "stock": 10
}
```

### Eliminar producto
Authorization: Bearer <token>
```http
DELETE http://localhost:3000/productos/delete/1
```

