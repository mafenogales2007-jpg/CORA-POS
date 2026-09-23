##Genera reportes de caja rápidos solicitados por el administrador al finalizar el turno.

DELIMITER //
CREATE PROCEDURE sp_resumen_ventas_periodo(IN p_ini DATE, IN p_fin DATE)
BEGIN
    SELECT COUNT(idVentas) AS TotalFacturas, SUM(TotalVentas) AS IngresosTotales
    FROM ventas
    WHERE FechaVenta BETWEEN p_ini AND p_fin;
END//
DELIMITER ;

##Listar Productos con Stock Bajo

DELIMITER //
CREATE PROCEDURE sp_productos_bajo_stock()
BEGIN
    SELECT idProductos, StockProductos, EstadoProductos
    FROM productos
    WHERE StockProductos <= 30;
END//
DELIMITER ;

##Consultar Historial de Compras por Proveedor

DELIMITER //
CREATE PROCEDURE sp_historial_compras_proveedor(IN p_doc INT)
BEGIN
    SELECT c.idCompras, c.FechaCompras, c.TotalCompras, p.NombreProveedores
    FROM compras c
    INNER JOIN proveedores p ON c.Proveedores_DocumetoProveedores = p.DocumetoProveedores
    WHERE p.DocumetoProveedores = p_doc;
END//
DELIMITER ;