CREATE DATABASE IF NOT EXISTS rubikate;
USE rubikate;

CREATE TABLE IF NOT EXISTS `rubikate`.`acciones` (
  `idaccion` INT NOT NULL AUTO_INCREMENT,
  `Accion` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idaccion`))
COMMENT = 'Tabla de acciones';

CREATE TABLE IF NOT EXISTS`rubikate`.`administrador` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `clave` VARCHAR(255) NOT NULL,
  `rol` INT NOT NULL DEFAULT 0,
  `pregunta` INT NOT NULL,
  `respuesta` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
  `updated_at` TIMESTAMP NULL,
  UNIQUE KEY (`correo`),
  PRIMARY KEY (`id`))
COMMENT = 'Tabla de administradores';

CREATE TABLE IF NOT EXISTS `rubikate`.`auditorias` (
  `idauditoria` INT NOT NULL AUTO_INCREMENT,
  `idadministrador` INT NOT NULL,
  `idaccion` INT NOT NULL,
  `tabla` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idauditoria`))
COMMENT = 'Tabla de auditorias';

CREATE TABLE IF NOT EXISTS `rubikate`.`ciudades` (
  `idciudad` INT NOT NULL AUTO_INCREMENT,
  `idestado` INT NOT NULL,
  `ciudad` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idciudad`))
COMMENT = 'Tabla de ciudades';

CREATE TABLE IF NOT EXISTS `rubikate`.`clasificacion` (
  `idclasificacion` INT NOT NULL AUTO_INCREMENT,
  `clasificacion` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idclasificacion`))
COMMENT = 'Tabla de clasificacion';

CREATE TABLE IF NOT EXISTS `rubikate`.`emprendimientos` (
  `idemprendimiento` INT NOT NULL AUTO_INCREMENT,
  `idusuario` INT NOT NULL,
  `emprendimiento` VARCHAR(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `logo` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(100) NOT NULL,
  `servicio` VARCHAR(100) NULL,
  `delivery` TINYINT NOT NULL,
  `idciudad` INT NOT NULL,
  `idcategoria` INT NULL,
  `redesSociales` VARCHAR(255) NULL,
  `urlRedesSociales` VARCHAR(255) NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `coordenadas` VARCHAR(255) NULL,
  `sitioWeb` TINYINT NULL,
  `nombreUrl` VARCHAR(255) NULL,
  `videoUrl` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idemprendimiento`))
COMMENT = 'Tabla de emprendimientos';

CREATE TABLE IF NOT EXISTS `rubikate`.`especificacion` (
  `idespecificacion` INT NOT NULL AUTO_INCREMENT,
  `especificacion` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idespecificacion`))
COMMENT = 'Tabla de especificacion';

CREATE TABLE IF NOT EXISTS `rubikate`.`estados` (
  `idestado` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idestado`))
COMMENT = 'Tabla de estados';

CREATE TABLE `rubikate`.`extras` (
  `idextra` INT NOT NULL AUTO_INCREMENT,
  `extras` VARCHAR(255) NOT NULL,
  `precioExtra` INT NOT NULL,
  `idproducto` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idextra`))
COMMENT = 'Tabla de extras';

CREATE TABLE IF NOT EXISTS `rubikate`.`fotografia` (
  `idfotografia` INT NOT NULL AUTO_INCREMENT,
  `fotografia` VARCHAR(255) NOT NULL,
  `idproducto` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idfotografia`))
COMMENT = 'Tabla de fotografia';

CREATE TABLE IF NOT EXISTS `rubikate`.`fotos` (
  `idfoto` INT NOT NULL AUTO_INCREMENT,
  `foto1` VARCHAR(255) NULL,
  `foto2` VARCHAR(255) NULL,
  `foto3` VARCHAR(255) NULL,
  `foto4` VARCHAR(255) NULL,
  `foto5` VARCHAR(255) NULL,
  `foto6` VARCHAR(255) NULL,
  `banner` VARCHAR(255) NULL,
  `idpublicacion` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idfoto`))
COMMENT = 'Tabla de fotos';

CREATE TABLE IF NOT EXISTS `rubikate`.`imagenes` (
  `idimagen` INT NOT NULL AUTO_INCREMENT,
  `imagen` VARCHAR(255) NULL,
  `idpublicacion` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idimagen`))
COMMENT = 'Tabla de imagenes';


CREATE TABLE IF NOT EXISTS `rubikate`.`medida` (
  `idmedida` INT NOT NULL AUTO_INCREMENT,
  `medida` VARCHAR(145) NOT NULL,
  `valor` INT NOT NULL,
  `idespecificacion` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idmedida`))
COMMENT = 'Tabla de medidas';

CREATE TABLE IF NOT EXISTS `rubikate`.`notificaciones` (
  `idnotificacion` INT NOT NULL AUTO_INCREMENT,
  `idpublicacion` INT NOT NULL,
  `observacion` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idnotificacion`))
COMMENT = 'Tabla de notificaciones';

CREATE TABLE IF NOT EXISTS `rubikate`.`pedido` (
  `idpedido` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(145) NOT NULL,
  `cedula` VARCHAR(145) NOT NULL,
  `precio` INT NOT NULL,
  `total` INT NOT NULL,
  `fecha` TIMESTAMP NOT NULL,
  `cantidad` INT NOT NULL,
  `idproducto` INT NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idpedido`))
COMMENT = 'Tabla de pedido';

CREATE TABLE IF NOT EXISTS `rubikate`.`presentacion` (
  `idpresentacion` INT NOT NULL AUTO_INCREMENT,
  `presentacion` VARCHAR(255) NOT NULL,
  `descripcion` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idpresentacion`))
COMMENT = 'Tabla de presentacion';

CREATE TABLE IF NOT EXISTS `rubikate`.`producto` (
  `idproducto` INT NOT NULL AUTO_INCREMENT,
  `producto` VARCHAR(255) NOT NULL,
  `descripcion` LONGTEXT NOT NULL,
  `precio` INT NOT NULL,
  `idemprendimiento` INT NOT NULL,
  `idclasificacion` INT NOT NULL,
  `idpresentacion` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idproducto`))
COMMENT = 'Tabla de productos';

CREATE TABLE `rubikate`.`publicaciones` (
  `idpublicacion` INT NOT NULL AUTO_INCREMENT,
  `idadministrador` INT NULL,
  `fecha` TIMESTAMP NOT NULL,
  `idplan` INT NOT NULL,
  `idemprendimiento` INT NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  `top` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idpublicacion`),
  INDEX `fk_emp_idx` (`idemprendimiento` ASC),
  CONSTRAINT `fk_emp`
    FOREIGN KEY (`idemprendimiento`)
    REFERENCES `rubikate`.`emprendimientos` (`idemprendimiento`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
COMMENT = 'Tabla de publicaciones';

CREATE TABLE IF NOT EXISTS `rubikate`.`publikate` (
  `idpublikate` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `apellido` VARCHAR(255) NOT NULL,
  `emprendimiento` VARCHAR(255) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idpublikate`))
COMMENT = 'Tabla de publikate';

CREATE TABLE IF NOT EXISTS `rubikate`.`usuarios` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `apellido` VARCHAR(255) NOT NULL,
  `cedula` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(255) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  UNIQUE KEY (`cedula`),
  PRIMARY KEY (`idusuario`))
COMMENT = 'Tabla de usuarios';

/**
 * Modifique la tabla coloque nombre y descripcion, donde descripcion es tipo longtext, es decir, tiene 65565 caracteres de espacio.
 */
 
 /**
  * Tabla sessiones del middleware express-mysql-session
  */
  
CREATE TABLE IF NOT EXISTS `rubikate`.`sessions` ( 
`session_id` varchar(128) NOT NULL, 
`expires` int(11) unsigned NOT NULL, 
`data` text, 
PRIMARY KEY (`session_id`) 
) ENGINE=InnoDB;

/**
 * Tabla aliados
 */

CREATE TABLE `rubikate`.`aliados` (
  `idaliado` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `logo` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idaliado`),
  UNIQUE KEY (`correo`))
COMMENT = 'Tabla de aliados';

CREATE TABLE IF NOT EXISTS `rubikate`.`planes` (
  `idplan` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` LONGTEXT NOT NULL,
  `costo` INT NOT NULL,
  `duracion` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idplan`))
COMMENT = 'Tabla de planes';

/**
 * Agregue esta tabla, aqui se guardaran sus datos personales, solo llevará 1 registro.
 */

CREATE TABLE IF NOT EXISTS `rubikate`.`sitio` (
  `idsitio` INT NOT NULL,
  `direccion` VARCHAR(150) NULL,
  `telefono` VARCHAR(255) NULL,
  `correo` VARCHAR(145) NULL,
  `facebook` VARCHAR(250) NULL,
  `instagram` VARCHAR(250) NULL,
  `twitter` VARCHAR(250) NULL,
  `whatsapp` VARCHAR(250) NULL,
  `telegram` VARCHAR(250) NULL,
  PRIMARY KEY (`idsitio`))
COMMENT = 'Tabla del sitio';

/**
 * Agregue esta tabla, así se administrarán los slide del sitio.
 */
 
CREATE TABLE IF NOT EXISTS `rubikate`.`carrusel` (
  `idcarrusel` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) NOT NULL,
  `status` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`idcarrusel`))
COMMENT = 'Tabla del carrusel';

/**
 * Agregue una fila mas llamada imagen, allí ira la imagen de la categoria.
 */

CREATE TABLE IF NOT EXISTS `rubikate`.`categorias` (
  `idcategoria` INT NOT NULL AUTO_INCREMENT,
  `idpadre` INT NOT NULL DEFAULT 0,
  `nombre` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) NOT NULL,
  `color` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  UNIQUE KEY (`nombre`),
  PRIMARY KEY (`idcategoria`))
COMMENT = 'Tabla de categorias';

/**
 * Ingreso de usuario para pruebas
 */
INSERT INTO `rubikate`.`administrador` (`usuario`, `correo`, `clave`, `rol`, `pregunta`, `respuesta`) VALUES ('test', 'test@test.com', '$2b$10$ogz7jYzxgb2xQS1aKGsO2OoIgTWRxKbQ0R.4AEw30kcWw2XB7h1N2', '0', '1', 'test');