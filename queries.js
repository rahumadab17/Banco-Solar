const { Pool } = require('pg');

const config = {
    host: "127.0.0.1",
    port: 5432,
    database: "bancosolar",
    user: "postgres",
    password: "7804"
};

const pool = new Pool(config);

const insertarUsuario = async (nombre, balance) => {
    const consult = {
        text: "insert into usuarios (nombre, balance) values ($1, $2);",
        values: [nombre, balance]
    };

    const result = await pool.query(consult);
    return result;
};

const obtenerUsuarios = async () => {
    const result = await pool.query("select * from usuarios;");
    return result;
};

const eliminarUsuario = async (id) => {
    const borrar = {
        text: `delete from usuarios where id = '${id}'`
    }

    const result = pool.query(borrar);
    return result
};

module.exports = { insertarUsuario, obtenerUsuarios ,eliminarUsuario }