CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    siglas VARCHAR(10) NOT NULL UNIQUE,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE caja (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    siglas VARCHAR(10) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id)
);
CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    venta_id INTEGER NOT NULL REFERENCES venta(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    valor_venta NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    costo_mano_obra NUMERIC(12, 2) NOT NULL,
    costo_materiales_viaticos_fletes NUMERIC(12, 2) NOT NULL,
    costo_comision NUMERIC(12, 2) NOT NULL,
    estado_venta VARCHAR(20) NOT NULL
);
CREATE TABLE costo_fijo (
    id SERIAL PRIMARY KEY,
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    adjudicacion TEXT,
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE costo_variable (
    id SERIAL PRIMARY KEY,
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    adjudicacion TEXT,
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ajuste (
    id SERIAL PRIMARY KEY,
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    movimiento TEXT
);
CREATE TABLE aporte_socio (
    id SERIAL PRIMARY KEY,
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE dividendo_socio (
    id SERIAL PRIMARY KEY,
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE transferencia (
    id SERIAL PRIMARY KEY,
    caja_origen_id INTEGER NOT NULL REFERENCES caja(id),
    caja_destino_id INTEGER NOT NULL REFERENCES caja(id),
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (caja_origen_id <> caja_destino_id)
);
CREATE TABLE tasa (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    moneda_id_origen INTEGER NOT NULL REFERENCES moneda(id),
    moneda_id_destino INTEGER NOT NULL REFERENCES moneda(id),
    tasa NUMERIC(10, 4) NOT NULL
);
CREATE TABLE moneda (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo_iso VARCHAR(10) NOT NULL
);