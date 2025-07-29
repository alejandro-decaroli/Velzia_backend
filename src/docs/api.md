## API Reference

### Obtener todos los usuarios
```http
GET http://localhost:3000/usuarios
```

### Obtener usuario por ID
```http
GET http://localhost:3000/usuarios/1
```

### Crear usuario
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
```http
DELETE http://localhost:3000/usuarios/delete/1
```

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
  "caja": 1,
  "monto": 100.00,
  "movimiento": "egreso"
}
```

### Actualizar ajuste
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
  "caja": 1,
  "monto": 100
}
```

### Actualizar aporte
```http
PUT http://localhost:3000/aportes_socio/update/1
Content-Type: application/json

{
  "caja": 1,
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
  "moneda": 1,
  "siglas": "GZ",
  "monto": 100
}
```

### Actualizar caja
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
  "nombre": "pepe2",
  "apellido": "Apellido",
  "telefono": "12345678",
  "email": "pepe2@gmail.com",
  "direccion": "direccion",
  "siglas": "PP2"
}
```
### Actualizar cliente
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
```http
DELETE http://localhost:3000/clientes/delete/7
```

### Obtener todos los costos fijos
```http
GET http://localhost:3000/costos_fijos
```

### Obtener costos fijos por ID
```http
GET http://localhost:3000/costos_fijos/1
```

### Crear costos fijos
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
  "caja": 1,
  "adjudicacion": "Adjudicacion",
  "monto_real": 100,
  "venta": 1,
  "presupuestado": 100
}
```

### Actualizar costo variable
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
  "caja": 1,
  "monto": 100
}
```

### Actualizar dividendo
```http
PUT http://localhost:3000/dividendos_socio/update/1
Content-Type: application/json

{
  "caja": 1,
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
  "caja": 2,
  "monto": 300.0,
  "venta": 1
}
```

### Actualizar pago
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
  "moneda_origen": 1,
  "moneda_destino": 2,
  "tasa": 2
}
```

### Actualizar tasa
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
  "caja_origen": 1,
  "caja_destino": 22,
  "monto": 1000
}
```

### Actualizar transferencia
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
  "cliente": 1,
  "monto": 1000,
  "moneda": 1
}
```

### Actualizar venta
```http
PUT http://localhost:3000/ventas/update/1
Content-Type: application/json

{
  "cliente": 10,
  "monto": 1000,
  "moneda": 1
}
```