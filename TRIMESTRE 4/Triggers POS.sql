DELIMITER //

-- Trigger 1: Actualizar stock después de la venta
CREATE TRIGGER trg_actualizar_stock_venta
AFTER INSERT ON detalleventa
FOR EACH ROW
BEGIN
    UPDATE productos 
    SET StockProductos = StockProductos - NEW.CantidadVenta,
        SalidaProductos = SalidaProductos + NEW.CantidadVenta
    WHERE idProductos = NEW.Productos_idProductos;
END//

-- Trigger 2: Validar stock antes de insertar en detalleventa
CREATE TRIGGER trg_validar_stock_venta
BEFORE INSERT ON detalleventa
FOR EACH ROW
BEGIN
    DECLARE stock_actual INT;
    
    SELECT StockProductos INTO stock_actual 
    FROM productos 
    WHERE idProductos = NEW.Productos_idProductos;
    
    IF stock_actual < NEW.CantidadVenta THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Stock insuficiente para completar la venta de este producto.';
    END IF;
END//

DELIMITER ;