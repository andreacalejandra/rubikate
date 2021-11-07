const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./key');


const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('La conexión con la base de datos se cerrado.');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Demasiadas conexiones simultaneas con la base de datos.');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('La conexión a la base de datos ha sido rechazada.');
		}
	}

	if (connection) connection.release();
	console.log('Base de datos conectada con éxito.');
	return;
});

pool.query = promisify(pool.query);

module.exports = pool;
