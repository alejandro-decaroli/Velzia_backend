CREATE TABLE moneda (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo_iso VARCHAR(3) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    siglas VARCHAR(10) NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE caja (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    siglas VARCHAR(5) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    monto_ars NUMERIC(12, 2) NOT NULL,
    monto_usd NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    costo_mano_obra NUMERIC(12, 2) NOT NULL,
    costo_materiales_viaticos_fletes NUMERIC(12, 2) NOT NULL,
    costo_comision NUMERIC(12, 2) NOT NULL
);

CREATE TABLE costo_fijo (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    adjudicacion TEXT,
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE costo_variable (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    adjudicacion TEXT,
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ajuste (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    movimiento TEXT
);

CREATE TABLE aporte_socio (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    aporte TEXT,
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dividendo_socio (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    caja_id INTEGER NOT NULL REFERENCES caja(id),
    dividendo TEXT,
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transferencia (
    id SERIAL PRIMARY KEY,
    moneda_id INTEGER NOT NULL REFERENCES moneda(id),
    caja_origen_id INTEGER NOT NULL REFERENCES caja(id),
    caja_destino_id INTEGER NOT NULL REFERENCES caja(id),
    monto NUMERIC(12, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (caja_origen_id <> caja_destino_id)
);

CREATE TABLE tasa (
    id SERIAL PRIMARY KEY,
    moneda_id_origen INTEGER NOT NULL REFERENCES moneda(id),
    moneda_id_destino INTEGER NOT NULL REFERENCES moneda(id),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tasa NUMERIC(10, 4) NOT NULL
);