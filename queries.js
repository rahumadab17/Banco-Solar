const { Pool } = require('pg');

const config = {
    host: "127.0.0.1",
    port: 5432,
    database: "agendamiento_medico",
    user: "postgres",
    password: "7804"
};

const pool = new Pool(config);