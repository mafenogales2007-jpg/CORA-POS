##Analizar qué métodos de pago generan mayor volumen de ingresos para la caja registradora.

SELECT 
    f.DescripcionFormaDePago AS MetodoPago,
    COUNT(v.idVentas) AS TotalTransacciones,
    SUM(v.TotalVentas) AS IngresosTotales,
    AVG(v.TotalVentas) AS PromedioVenta
FROM ventas v
INNER JOIN formadepago f ON v.FormaDePago_idFormaDePago = f.idFormaDePago
GROUP BY f.idFormaDePago, f.DescripcionFormaDePago
ORDER BY IngresosTotales DESC;

##Identificar aquellos productos cuyo inventario está por debajo de un límite operativo para planificar reabastecimiento.

SELECT 
    p.idProductos,
    c.NombreCategoria AS Categoria,
    p.StockProductos AS StockActual,
    p.EstadoProductos
FROM productos p
INNER JOIN categoria c ON p.Categoria_idCategoria1 = c.idCategoria
WHERE p.StockProductos <= 40
ORDER BY p.StockProductos ASC;

##Conocer cuáles son los clientes más frecuentes que aportan más ingresos al negocio mediante sus compras acumuladas.

SELECT 
    cl.DocumentoCliente,
    CONCAT(cl.NombreCliente, ' ', cl.ApellidoCliente) AS NombreCompleto,
    COUNT(v.idVentas) AS CantidadCompras,
    SUM(v.TotalVentas) AS TotalGastado
FROM cliente cl
INNER JOIN ventas v ON cl.DocumentoCliente = v.Cliente_DocumentoCliente
GROUP BY cl.DocumentoCliente, cl.NombreCliente, cl.ApellidoCliente
ORDER BY TotalGastado DESC
LIMIT 5;

##Evaluar qué categorías de productos tienen mayor salida y generan más valor en las transacciones de venta.

SELECT 
    cat.NombreCategoria,
    SUM(dv.CantidadVenta) AS UnidadesVendidas,
    SUM(dv.TotalVenta) AS TotalVentasCategoria
FROM detalleventa dv
INNER JOIN productos p ON dv.Productos_idProductos = p.idProductos
INNER JOIN categoria cat ON p.Categoria_idCategoria1 = cat.idCategoria
GROUP BY cat.idCategoria, cat.NombreCategoria
ORDER BY TotalVentasCategoria DESC;

##Auditar el flujo de compras hechas a los proveedores y el impacto del IVA en la inversión de inventario.

SELECT 
    cp.idCompras,
    cp.FechaCompras,
    prov.NombreProveedores,
    cp.SubTotalCompras,
    cp.IvaTotalCompras,
    cp.TotalCompras
FROM compras cp
INNER JOIN proveedores prov ON cp.Proveedores_DocumetoProveedores = prov.DocumetoProveedores
ORDER BY cp.FechaCompras DESC;

##Listar los usuarios del sistema POS junto con el rol que desempeñan y su información de contacto para control interno.

SELECT 
    u.DocumentoUsuario,
    CONCAT(u.NombreUsuario, ' ', u.ApellidoUsuario) AS Empleado,
    u.EmailUsuario,
    r.DescripcionRol AS RolSistema
FROM usuario u
INNER JOIN roles r ON u.Roles_idRoles = r.idRoles
ORDER BY r.idRoles, u.NombreUsuario;

##Identificar los productos estrella que más dinero dejan en caja según el detalle de venta.

SELECT 
    p.idProductos,
    c.NombreCategoria,
    SUM(dv.CantidadVenta) AS TotalCantidadVendida,
    SUM(dv.TotalVenta) AS IngresosGenerados
FROM detalleventa dv
INNER JOIN productos p ON dv.Productos_idProductos = p.idProductos
INNER JOIN categoria c ON p.Categoria_idCategoria1 = c.idCategoria
GROUP BY p.idProductos, c.NombreCategoria
ORDER BY IngresosGenerados DESC;

##Revisar el comportamiento diario de las ventas para detectar los días con mayor rotación de caja.

SELECT 
    v.FechaVenta,
    COUNT(v.idVentas) AS NumeroFacturas,
    SUM(v.SubTotalVentas) AS SubtotalDia,
    SUM(v.IvaVentas) AS IvaDia,
    SUM(v.TotalVentas) AS TotalVentasDia
FROM ventas v
GROUP BY v.FechaVenta
ORDER BY v.FechaVenta ASC;

##Verificar las capacidades y restricciones de seguridad que tiene cada rol (Administrador o Cajero) en el POS.

SELECT 
    r.DescripcionRol,
    COUNT(rp.Permisos_idPermisos) AS TotalPermisosAsignados
FROM roles r
INNER JOIN roles_has_permisos rp ON r.idRoles = rp.Roles_idRoles
GROUP BY r.idRoles, r.DescripcionRol;

##Examinar los costos unitarios de adquisición por cada línea de detalle de compra realizada a los proveedores.

SELECT 
    dc.idDetalleCompra,
    dc.Compras_idCompras1 AS IdCompra,
    dc.CantidadCompra,
    dc.ValorUnitarioCompra,
    dc.TotalCompra
FROM detallecompra dc
ORDER BY dc.TotalCompra DESC;