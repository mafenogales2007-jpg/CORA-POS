##Calcular el Valor del IVA de un Monto

DELIMITER //
CREATE FUNCTION fn_calcular_iva(p_subtotal FLOAT, p_porcentaje_iva FLOAT) 
RETURNS FLOAT
DETERMINISTIC
BEGIN
    RETURN p_subtotal * (p_porcentaje_iva / 100);
END//
DELIMITER ;

##Determinar el Estado del Stock de un Producto

DELIMITER //
CREATE FUNCTION fn_estado_stock(p_stock INT) 
RETURNS VARCHAR(25)
DETERMINISTIC
BEGIN
    DECLARE v_estado VARCHAR(25);
    IF p_stock = 0 THEN
        SET v_estado = 'Agotado';
    ELSEIF p_stock <= 20 THEN
        SET v_estado = 'Stock Crítico';
    ELSE
        SET v_estado = 'Disponible';
    END IF;
    RETURN v_estado;
END//
DELIMITER ;