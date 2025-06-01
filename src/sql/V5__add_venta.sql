INSERT INTO venta (
    cliente_id,
    moneda_id,
    valor_venta,
    costo_mano_obra,
    costo_materiales_viaticos_fletes,
    costo_comision,
    estado_venta
  )
VALUES (1, 1, 6000, 1000, 1000, 1000, 'Activo'),
  (2, 1, 6000, 1000, 1000, 1000, 'Activo'),
  (3, 2, 6000, 1000, 1000, 1000, 'Terminado'),
  (4, 2, 6000, 1000, 1000, 1000, 'Terminado');