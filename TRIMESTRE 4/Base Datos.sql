-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `idCategoria` int(11) NOT NULL COMMENT 'Identificador de la categoría\n',
  `NombreCategoria` varchar(45) NOT NULL COMMENT 'Nombre de la categoría\n',
  PRIMARY KEY (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Granos y Cereales'),(2,'Bebidas'),(3,'Aseo del Hogar'),(4,'Cuidado Personal'),(5,'Lácteos y Huevos'),(6,'Panadería'),(7,'Carnes y Embutidos'),(8,'Frutas y Verduras'),(9,'Enlatados y Conservas'),(10,'Aceites y Condimentos'),(11,'Snacks y Pasabocas'),(12,'Café, Chocolate e Infusiones'),(13,'Productos de Bebé'),(14,'Mascotas'),(15,'Congelados'),(16,'Licores'),(17,'Papel y Desechables'),(18,'Salsas y Aderezos'),(19,'Pastas y Harinas'),(20,'Cuidado Capilar');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `DocumentoCliente` varchar(45) NOT NULL,
  `NombreCliente` varchar(45) NOT NULL COMMENT 'Nombre del cliente\n',
  `ApellidoCliente` varchar(45) NOT NULL COMMENT 'Apellido del cliente\n',
  `DireccionCliente` varchar(45) NOT NULL COMMENT 'Dirección de el cliente',
  `TelefonoCliente` varchar(45) NOT NULL COMMENT 'Teléfono de el cliente',
  `EmailCliente` varchar(45) NOT NULL COMMENT 'Correo electrónico de el cliente',
  `EstadoCliente` varchar(45) NOT NULL,
  `TipoDocumento_idTipoDocumento` int(11) NOT NULL,
  PRIMARY KEY (`DocumentoCliente`),
  KEY `fk_Cliente_TipoDocumento1_idx` (`TipoDocumento_idTipoDocumento`),
  CONSTRAINT `fk_Cliente_TipoDocumento1` FOREIGN KEY (`TipoDocumento_idTipoDocumento`) REFERENCES `tipodocumento` (`idTipoDocumento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES ('1010000000','Andrés','Rojas','Calle 12 #8-5','3111000000','andrés.rojas@correo.com','Activo',2),('1010002222','Sofía','Martínez','Calle 13 #9-6','3111000191','sofía.martínez@correo.com','Activo',1),('1010004444','Pedro','Londoño','Calle 14 #10-7','3111000382','pedro.londoño@correo.com','Activo',1),('1010006666','Camila','Vargas','Calle 15 #11-8','3111000573','camila.vargas@correo.com','Activo',1),('1010008888','Diego','Castro','Calle 16 #12-9','3111000764','diego.castro@correo.com','Activo',1),('1010011110','Valentina','Morales','Calle 17 #13-10','3111000955','valentina.morales@correo.com','Activo',2),('1010013332','Santiago','Ortiz','Calle 18 #14-11','3111001146','santiago.ortiz@correo.com','Activo',1),('1010015554','Isabella','Suárez','Calle 19 #15-12','3111001337','isabella.suárez@correo.com','Activo',1),('1010017776','Miguel','Jiménez','Calle 20 #16-13','3111001528','miguel.jiménez@correo.com','Activo',1),('1010019998','Daniela','Herrera','Calle 21 #17-14','3111001719','daniela.herrera@correo.com','Activo',1),('1010022220','Felipe','Molina','Calle 22 #18-15','3111001910','felipe.molina@correo.com','Activo',2),('1010024442','Natalia','Rincón','Calle 23 #19-16','3111002101','natalia.rincón@correo.com','Activo',1),('1010026664','Julián','Cardona','Calle 24 #20-17','3111002292','julian.cardona@correo.com','Activo',1),('1010028886','Paula','Salazar','Calle 25 #21-18','3111002483','paula.salazar@correo.com','Activo',1),('1010031108','Óscar','Reyes','Calle 26 #22-19','3111002674','oscar.reyes@correo.com','Activo',1),('1010033330','Carolina','Cifuentes','Calle 27 #23-20','3111002865','carolina.cifuentes@correo.com','Activo',2),('1010035552','Ricardo','Aguilar','Calle 28 #24-21','3111003056','ricardo.aguilar@correo.com','Activo',1),('1010037774','Manuela','Peña','Calle 29 #25-22','3111003247','manuela.peña@correo.com','Activo',1),('1010039996','Esteban','Nieto','Calle 30 #26-23','3111003438','esteban.nieto@correo.com','Activo',1),('1010042218','Alejandra','Guerrero','Calle 31 #27-24','3111003629','alejandra.guerrero@correo.com','Activo',1);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `idCompras` int(11) NOT NULL COMMENT 'Identificador de la compra\n',
  `FechaCompras` date NOT NULL COMMENT 'Fecha de la compra',
  `HoraCompras` time NOT NULL COMMENT 'Hora de la compra',
  `SubTotalCompras` float NOT NULL COMMENT 'Subtotal de la compra',
  `IvaTotalCompras` float NOT NULL COMMENT 'IVA total de la compra',
  `TotalCompras` float NOT NULL COMMENT 'Total de la cmpra',
  `Proveedores_DocumetoProveedores` int(11) NOT NULL,
  PRIMARY KEY (`idCompras`),
  KEY `fk_Compras_Proveedores1_idx` (`Proveedores_DocumetoProveedores`),
  CONSTRAINT `fk_Compras_Proveedores1` FOREIGN KEY (`Proveedores_DocumetoProveedores`) REFERENCES `proveedores` (`DocumetoProveedores`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,'2026-01-01','08:00:00',133000,25270,158270,900001221),(2,'2026-02-02','09:07:00',231000,43890,274890,900000666),(3,'2026-03-03','10:14:00',393000,74670,467670,900000888),(4,'2026-04-04','11:21:00',409000,77710,486710,900000222),(5,'2026-05-05','12:28:00',361000,68590,429590,900000555),(6,'2026-06-06','13:35:00',323000,61370,384370,900000777),(7,'2026-07-07','14:42:00',133000,25270,158270,900001554),(8,'2026-08-08','15:49:00',244000,46360,290360,900000888),(9,'2026-09-09','16:56:00',377000,71630,448630,900001887),(10,'2026-10-10','17:03:00',162000,30780,192780,900001110),(11,'2026-11-11','08:10:00',481000,91390,572390,900000111),(12,'2026-12-12','09:17:00',167000,31730,198730,900000111),(13,'2026-01-13','10:24:00',462000,87780,549780,900001110),(14,'2026-02-14','11:31:00',255000,48450,303450,900000888),(15,'2026-03-15','12:38:00',83000,15770,98770,900000666),(16,'2026-04-16','13:45:00',340000,64600,404600,900001110),(17,'2026-05-17','14:52:00',158000,30020,188020,900001665),(18,'2026-06-18','15:59:00',252000,47880,299880,900001554),(19,'2026-07-19','16:06:00',123000,23370,146370,900000888),(20,'2026-08-20','17:13:00',121000,22990,143990,900000777);
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallecompra`
--

DROP TABLE IF EXISTS `detallecompra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallecompra` (
  `idDetalleCompra` int(11) NOT NULL,
  `CantidadCompra` int(11) NOT NULL COMMENT 'Cantidad adquirida\n',
  `ValorUnitarioCompra` int(11) NOT NULL COMMENT 'Valor unitario\\n',
  `SubTotalCompra` int(11) NOT NULL COMMENT 'Subtotal\\n',
  `TotalCompra` int(11) NOT NULL COMMENT 'Total\\n',
  `Compras_idCompras1` int(11) NOT NULL,
  PRIMARY KEY (`idDetalleCompra`),
  KEY `fk_DetalleCompra_Compras1_idx` (`Compras_idCompras1`),
  CONSTRAINT `fk_DetalleCompra_Compras1` FOREIGN KEY (`Compras_idCompras1`) REFERENCES `compras` (`idCompras`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallecompra`
--

LOCK TABLES `detallecompra` WRITE;
/*!40000 ALTER TABLE `detallecompra` DISABLE KEYS */;
INSERT INTO `detallecompra` VALUES (1,100,37789,3778900,3778900,1),(2,73,18219,1329987,1329987,2),(3,100,39311,3931100,3931100,3),(4,59,39242,2315278,2315278,4),(5,56,24723,1384488,1384488,5),(6,33,10065,332145,332145,6),(7,70,33343,2334010,2334010,7),(8,16,4087,65392,65392,8),(9,19,11016,209304,209304,9),(10,85,11484,976140,976140,10),(11,92,28666,2637272,2637272,11),(12,81,5163,418203,418203,12),(13,54,26009,1404486,1404486,13),(14,81,31674,2565594,2565594,14),(15,72,17476,1258272,1258272,15),(16,75,1752,131400,131400,16),(17,92,48233,4437436,4437436,17),(18,19,45676,867844,867844,18),(19,73,18486,1349478,1349478,19),(20,87,23293,2026491,2026491,20);
/*!40000 ALTER TABLE `detallecompra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleventa`
--

DROP TABLE IF EXISTS `detalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleventa` (
  `idDetalleVenta` int(11) NOT NULL,
  `CantidadVenta` int(11) NOT NULL COMMENT 'Cantidad vendida\n',
  `ValorUnitarioVenta` float NOT NULL COMMENT 'Valor unitario\n',
  `SubTotalVenta` float NOT NULL COMMENT 'Subtotal\n',
  `IvaVenta` float NOT NULL COMMENT 'IVA\n',
  `TotalVenta` float NOT NULL COMMENT 'Total de la venta',
  `Ventas_idVentas` int(11) NOT NULL,
  `Productos_idProductos` int(11) NOT NULL,
  PRIMARY KEY (`idDetalleVenta`),
  KEY `fk_DetalleVenta_Ventas1_idx` (`Ventas_idVentas`),
  KEY `fk_DetalleVenta_Productos1_idx` (`Productos_idProductos`),
  CONSTRAINT `fk_DetalleVenta_Productos1` FOREIGN KEY (`Productos_idProductos`) REFERENCES `productos` (`idProductos`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_DetalleVenta_Ventas1` FOREIGN KEY (`Ventas_idVentas`) REFERENCES `ventas` (`idVentas`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventa`
--

LOCK TABLES `detalleventa` WRITE;
/*!40000 ALTER TABLE `detalleventa` DISABLE KEYS */;
INSERT INTO `detalleventa` VALUES (1,9,23643,212787,40430,253217,1,1),(2,5,71163,355815,67605,423420,2,4),(3,14,81507,1141100,216809,1357910,3,7),(4,7,29760,208320,39581,247901,4,10),(5,15,72686,1090290,207155,1297440,5,13),(6,13,97673,1269750,241252,1511000,6,16),(7,12,28365,340380,64672,405052,7,19),(8,12,42857,514284,97714,611998,8,2),(9,7,90039,630273,119752,750025,9,5),(10,11,50944,560384,106473,666857,10,8),(11,8,69839,558712,106155,664867,11,11),(12,8,17860,142880,27147,170027,12,14),(13,4,31451,125804,23903,149707,13,17),(14,2,46313,92626,17599,110225,14,20),(15,1,79110,79110,15031,94141,15,3),(16,9,32161,289449,54995,344444,16,6),(17,10,30864,308640,58642,367282,17,9),(18,1,11305,11305,2148,13453,18,12),(19,12,84719,1016630,193159,1209790,19,15),(20,1,32007,32007,6081,38088,20,18);
/*!40000 ALTER TABLE `detalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formadepago`
--

DROP TABLE IF EXISTS `formadepago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formadepago` (
  `idFormaDePago` int(11) NOT NULL,
  `DescripcionFormaDePago` varchar(45) NOT NULL,
  PRIMARY KEY (`idFormaDePago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formadepago`
--

LOCK TABLES `formadepago` WRITE;
/*!40000 ALTER TABLE `formadepago` DISABLE KEYS */;
INSERT INTO `formadepago` VALUES (1,'Efectivo'),(2,'Tarjeta Débito'),(3,'Tarjeta Crédito'),(4,'Transferencia Bancaria'),(5,'PSE'),(6,'Nequi'),(7,'Daviplata');
/*!40000 ALTER TABLE `formadepago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `idPermisos` int(11) NOT NULL COMMENT 'Identificador del permiso\n',
  `NombrePermisos` varchar(45) NOT NULL COMMENT 'Nombre del permiso\n',
  PRIMARY KEY (`idPermisos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,'Gestionar Usuarios'),(2,'Gestionar Productos'),(3,'Gestionar Categorías'),(4,'Gestionar Proveedores'),(5,'Gestionar Compras'),(6,'Registrar Ventas'),(7,'Anular Ventas'),(8,'Gestionar Clientes'),(9,'Consultar Inventario'),(10,'Aplicar Descuentos'),(11,'Abrir Caja'),(12,'Cerrar Caja'),(13,'Emitir Facturas'),(14,'Registrar Devoluciones'),(15,'Consultar Reportes de Ventas'),(16,'Consultar Reportes de Compras'),(17,'Gestionar Formas de Pago'),(18,'Modificar Precios'),(19,'Gestionar Roles y Permisos'),(20,'Consultar Historial de Movimientos');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `idProductos` int(11) NOT NULL COMMENT 'Identificador del producto\n',
  `NombreProductos` varchar(45) NOT NULL COMMENT 'Nombre de el producto',
  `DescripcioProductos` text NOT NULL COMMENT 'Descripción de el producto',
  `EntradaProductos` int(11) NOT NULL COMMENT 'Entradas al Stock',
  `SalidaProductos` int(11) NOT NULL COMMENT 'Salidas del stock',
  `StockProductos` int(11) NOT NULL COMMENT 'Existencias disponibles\n',
  `EstadoProductos` varchar(45) NOT NULL,
  `IVAProductos` varchar(45) NOT NULL,
  `Categoria_idCategoria1` int(11) NOT NULL,
  `DetalleCompra_idDetalleCompra` int(11) NOT NULL,
  PRIMARY KEY (`idProductos`),
  KEY `fk_Productos_Categoria2_idx` (`Categoria_idCategoria1`),
  KEY `fk_Productos_DetalleCompra1_idx` (`DetalleCompra_idDetalleCompra`),
  CONSTRAINT `fk_Productos_Categoria2` FOREIGN KEY (`Categoria_idCategoria1`) REFERENCES `categoria` (`idCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Productos_DetalleCompra1` FOREIGN KEY (`DetalleCompra_idDetalleCompra`) REFERENCES `detallecompra` (`idDetalleCompra`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'','Descripción de Arroz Diana 500g',21,6,15,'Activo','0%',1,1),(2,'','Descripción de Frijol Cargamanto 500g',198,14,184,'Activo','0%',1,2),(3,'','Descripción de Coca-Cola 1.5L',107,9,98,'Activo','19%',2,3),(4,'','Descripción de Jugo Hit Naranja 1L',59,7,52,'Activo','19%',2,4),(5,'','Descripción de Jabón Rey Multiusos',106,4,102,'Activo','19%',3,5),(6,'','Descripción de Detergente Fab 1kg',43,13,30,'Activo','19%',3,6),(7,'','Descripción de Shampoo Head & Shoulders 400ml',44,12,32,'Activo','19%',4,7),(8,'','Descripción de Crema Dental Colgate 100ml',108,20,88,'Activo','19%',4,8),(9,'','Descripción de Leche Alpina 1L',87,2,85,'Activo','0%',5,9),(10,'','Descripción de Huevos AA x30',137,18,119,'Activo','0%',5,10),(11,'','Descripción de Pan Tajado Bimbo',51,13,38,'Activo','0%',6,11),(12,'','Descripción de Pan Francés x6',40,18,22,'Activo','0%',6,12),(13,'','Descripción de Jamón Zenú 250g',95,20,75,'Activo','19%',7,13),(14,'','Descripción de Chorizo Santarrosano 500g',112,19,93,'Activo','19%',7,14),(15,'','Descripción de Manzana Roja kg',69,3,66,'Activo','0%',8,15),(16,'','Descripción de Papa Pastusa kg',31,8,23,'Activo','0%',8,16),(17,'','Descripción de Atún Van Camps 170g',94,3,91,'Activo','19%',9,17),(18,'','Descripción de Maíz Tierno Enlatado 300g',79,4,75,'Activo','19%',9,18),(19,'','Descripción de Aceite Girasol 1L',117,9,108,'Activo','19%',10,19),(20,'','Descripción de Salsa de Tomate Fruco 400g',136,12,124,'Activo','19%',18,20);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `DocumetoProveedores` int(11) NOT NULL COMMENT '\n\n',
  `NombreProveedores` varchar(45) NOT NULL COMMENT 'Nombre de el proveedor',
  `DireccionProveedores` varchar(45) NOT NULL COMMENT 'Dirección de el proveedor',
  `TelefonoProveedores` varchar(45) NOT NULL COMMENT 'Teléfono de el proveedor',
  `EmailProveedores` varchar(45) NOT NULL COMMENT 'Correo electrónico de el proveedor',
  `TipoDocumento_idTipoDocumento1` int(11) NOT NULL,
  PRIMARY KEY (`DocumetoProveedores`),
  KEY `fk_Proveedores_TipoDocumento2_idx` (`TipoDocumento_idTipoDocumento1`),
  CONSTRAINT `fk_Proveedores_TipoDocumento2` FOREIGN KEY (`TipoDocumento_idTipoDocumento1`) REFERENCES `tipodocumento` (`idTipoDocumento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (900000000,'Distribuidora ABC S.A.S','Calle 10 #5-20','3201000000','contacto1@proveedor.com',3),(900000111,'Suministros del Eje S.A.S','Calle 11 #6-21','3201000137','contacto2@proveedor.com',3),(900000222,'Comercial Andina Ltda','Calle 12 #7-22','3201000274','contacto3@proveedor.com',3),(900000333,'Importadora Global SAS','Calle 13 #8-23','3201000411','contacto4@proveedor.com',3),(900000444,'Proveedora Nacional Ltda','Calle 14 #9-24','3201000548','contacto5@proveedor.com',3),(900000555,'Insumos y Más SAS','Calle 15 #10-25','3201000685','contacto6@proveedor.com',3),(900000666,'Mayorista Central SAS','Calle 16 #11-26','3201000822','contacto7@proveedor.com',3),(900000777,'Comercializadora del Norte','Calle 17 #12-27','3201000959','contacto8@proveedor.com',3),(900000888,'Distribuciones Pacífico SAS','Calle 18 #13-28','3201001096','contacto9@proveedor.com',3),(900000999,'Grupo Empresarial Andino','Calle 19 #14-29','3201001233','contacto10@proveedor.com',3),(900001110,'Suministros Industriales SAS','Calle 20 #15-30','3201001370','contacto11@proveedor.com',3),(900001221,'Comercial Los Andes Ltda','Calle 21 #16-31','3201001507','contacto12@proveedor.com',3),(900001332,'Distribuidora Occidente SAS','Calle 22 #17-32','3201001644','contacto13@proveedor.com',3),(900001443,'Importaciones del Caribe SAS','Calle 23 #18-33','3201001781','contacto14@proveedor.com',3),(900001554,'Mayoristas Unidos Ltda','Calle 24 #19-34','3201001918','contacto15@proveedor.com',3),(900001665,'Proveedores Express SAS','Calle 25 #20-35','3201002055','contacto16@proveedor.com',3),(900001776,'Comercializadora Oriente SAS','Calle 26 #21-36','3201002192','contacto17@proveedor.com',3),(900001887,'Distribuciones del Valle SAS','Calle 27 #22-37','3201002329','contacto18@proveedor.com',3),(900001998,'Grupo Comercial Sur Ltda','Calle 28 #23-38','3201002466','contacto19@proveedor.com',3),(900002109,'Insumos Nacionales SAS','Calle 29 #24-39','3201002603','contacto20@proveedor.com',3);
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idRoles` int(11) NOT NULL,
  `DescripcionRol` varchar(45) NOT NULL,
  PRIMARY KEY (`idRoles`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(2,'Cajero');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_has_permisos`
--

DROP TABLE IF EXISTS `roles_has_permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_has_permisos` (
  `Roles_idRoles` int(11) NOT NULL,
  `Permisos_idPermisos` int(11) NOT NULL,
  PRIMARY KEY (`Roles_idRoles`,`Permisos_idPermisos`),
  KEY `fk_Roles_has_Permisos_Permisos1_idx` (`Permisos_idPermisos`),
  KEY `fk_Roles_has_Permisos_Roles1_idx` (`Roles_idRoles`),
  CONSTRAINT `fk_Roles_has_Permisos_Permisos1` FOREIGN KEY (`Permisos_idPermisos`) REFERENCES `permisos` (`idPermisos`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Roles_has_Permisos_Roles1` FOREIGN KEY (`Roles_idRoles`) REFERENCES `roles` (`idRoles`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_has_permisos`
--

LOCK TABLES `roles_has_permisos` WRITE;
/*!40000 ALTER TABLE `roles_has_permisos` DISABLE KEYS */;
INSERT INTO `roles_has_permisos` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(2,6),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,17);
/*!40000 ALTER TABLE `roles_has_permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipodocumento`
--

DROP TABLE IF EXISTS `tipodocumento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipodocumento` (
  `idTipoDocumento` int(11) NOT NULL,
  `DescripcionTipoDocumento` varchar(40) NOT NULL,
  PRIMARY KEY (`idTipoDocumento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipodocumento`
--

LOCK TABLES `tipodocumento` WRITE;
/*!40000 ALTER TABLE `tipodocumento` DISABLE KEYS */;
INSERT INTO `tipodocumento` VALUES (1,'Cédula de Ciudadanía'),(2,'Cédula de Extranjería'),(3,'NIT'),(4,'Pasaporte');
/*!40000 ALTER TABLE `tipodocumento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `DocumentoUsuario` int(11) NOT NULL,
  `NombreUsuario` varchar(45) NOT NULL COMMENT 'Nombre de el usuario',
  `ApellidoUsuario` varchar(45) NOT NULL COMMENT 'Apellido de el usuario',
  `DireccionUsuario` varchar(45) NOT NULL COMMENT 'Dirección de el usuario',
  `TelefonoUsuario` varchar(45) NOT NULL COMMENT 'Teléfono de el usuario',
  `EmailUsuario` varchar(45) NOT NULL COMMENT 'Correo electrónico\n',
  `TipoDocumento_idTipoDocumento` int(11) NOT NULL,
  `Roles_idRoles` int(11) NOT NULL,
  PRIMARY KEY (`DocumentoUsuario`),
  KEY `fk_Usuario_TipoDocumento1_idx` (`TipoDocumento_idTipoDocumento`),
  KEY `fk_Usuario_Roles1_idx` (`Roles_idRoles`),
  CONSTRAINT `fk_Usuario_Roles1` FOREIGN KEY (`Roles_idRoles`) REFERENCES `roles` (`idRoles`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuario_TipoDocumento1` FOREIGN KEY (`TipoDocumento_idTipoDocumento`) REFERENCES `tipodocumento` (`idTipoDocumento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1001000000,'Juan','Pérez','Cra 15 #20-30','3001000000','juan.pérez@empresa.com',1,1),(1001001111,'María','Gómez','Cra 16 #21-31','3001000211','maría.gómez@empresa.com',1,1),(1001002222,'Carlos','Ramírez','Cra 17 #22-32','3001000422','carlos.ramírez@empresa.com',2,1),(1001003333,'Laura','Torres','Cra 18 #23-33','3001000633','laura.torres@empresa.com',1,2),(1001004444,'Andrés','Rojas','Cra 19 #24-34','3001000844','andrés.rojas@empresa.com',1,2),(1001005555,'Sofía','Martínez','Cra 20 #25-35','3001001055','sofía.martínez@empresa.com',1,2),(1001006666,'Pedro','Londoño','Cra 21 #26-36','3001001266','pedro.londoño@empresa.com',1,2),(1001007777,'Camila','Vargas','Cra 22 #27-37','3001001477','camila.vargas@empresa.com',1,2),(1001008888,'Diego','Castro','Cra 23 #28-38','3001001688','diego.castro@empresa.com',2,2),(1001009999,'Valentina','Morales','Cra 24 #29-39','3001001899','valentina.morales@empresa.com',1,2),(1001011110,'Santiago','Ortiz','Cra 25 #30-40','3001002110','santiago.ortiz@empresa.com',1,2),(1001012221,'Isabella','Suárez','Cra 26 #31-41','3001002321','isabella.suárez@empresa.com',1,2),(1001013332,'Miguel','Jiménez','Cra 27 #32-42','3001002532','miguel.jiménez@empresa.com',1,2),(1001014443,'Daniela','Herrera','Cra 28 #33-43','3001002743','daniela.herrera@empresa.com',1,2),(1001015554,'Felipe','Molina','Cra 29 #34-44','3001002954','felipe.molina@empresa.com',1,2),(1001016665,'Natalia','Rincón','Cra 30 #35-45','3001003165','natalia.rincón@empresa.com',1,2),(1001017776,'Julián','Cardona','Cra 31 #36-46','3001003376','julian.cardona@empresa.com',2,2),(1001018887,'Paula','Salazar','Cra 32 #37-47','3001003587','paula.salazar@empresa.com',1,2),(1001019998,'Óscar','Reyes','Cra 33 #38-48','3001003798','oscar.reyes@empresa.com',2,2),(1001021109,'Carolina','Cifuentes','Cra 34 #39-49','3001004009','carolina.cifuentes@empresa.com',2,2);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `idVentas` int(11) NOT NULL COMMENT 'Identificador de la venta\n',
  `FechaVenta` date NOT NULL COMMENT 'Fecha de venta\n',
  `HoraVentas` time DEFAULT NULL COMMENT 'Hora de venta\n',
  `SubTotalVentas` float NOT NULL COMMENT 'Subtotal de la venta',
  `IvaVentas` float NOT NULL COMMENT 'IVA de la venta',
  `TotalVentas` float NOT NULL COMMENT 'Total de la vemnta',
  `EstadoVentas` varchar(45) NOT NULL COMMENT 'Estado de la venta\n',
  `FormaDePago_idFormaDePago` int(11) NOT NULL,
  `Cliente_DocumentoCliente` varchar(45) NOT NULL,
  PRIMARY KEY (`idVentas`),
  KEY `fk_Ventas_FormaDePago1_idx` (`FormaDePago_idFormaDePago`),
  KEY `fk_Ventas_Cliente1_idx` (`Cliente_DocumentoCliente`),
  CONSTRAINT `fk_Ventas_Cliente1` FOREIGN KEY (`Cliente_DocumentoCliente`) REFERENCES `cliente` (`DocumentoCliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ventas_FormaDePago1` FOREIGN KEY (`FormaDePago_idFormaDePago`) REFERENCES `formadepago` (`idFormaDePago`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,'2026-01-01','09:00:00',67000,12730,79730,'Pagada',1,'1010000000'),(2,'2026-02-02','10:11:00',232000,44080,276080,'Pagada',2,'1010002222'),(3,'2026-03-03','11:22:00',242000,45980,287980,'Pagada',3,'1010004444'),(4,'2026-04-04','12:33:00',144000,27360,171360,'Pagada',4,'1010006666'),(5,'2026-05-05','13:44:00',101000,19190,120190,'Pagada',5,'1010008888'),(6,'2026-06-06','14:55:00',64000,12160,76160,'Pagada',6,'1010011110'),(7,'2026-07-07','15:06:00',269000,51110,320110,'Pagada',7,'1010013332'),(8,'2026-08-08','16:17:00',111000,21090,132090,'Pagada',1,'1010015554'),(9,'2026-09-09','17:28:00',201000,38190,239190,'Pagada',2,'1010017776'),(10,'2026-10-10','09:39:00',286000,54340,340340,'Pagada',3,'1010019998'),(11,'2026-11-11','10:50:00',10000,1900,11900,'Pagada',4,'1010000000'),(12,'2026-12-12','11:01:00',175000,33250,208250,'Pagada',5,'1010002222'),(13,'2026-01-13','12:12:00',19000,3610,22610,'Pagada',6,'1010004444'),(14,'2026-02-14','13:23:00',195000,37050,232050,'Pagada',7,'1010006666'),(15,'2026-03-15','14:34:00',132000,25080,157080,'Pagada',1,'1010008888'),(16,'2026-04-16','15:45:00',133000,25270,158270,'Pagada',2,'1010011110'),(17,'2026-05-17','16:56:00',50000,9500,59500,'Pagada',3,'1010013332'),(18,'2026-06-18','17:07:00',258000,49020,307020,'Pagada',4,'1010015554'),(19,'2026-07-19','09:18:00',282000,53580,335580,'Pagada',5,'1010000000'),(20,'2026-08-20','10:29:00',75000,14250,89250,'Pagada',6,'1010002222');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-20 21:05:46
