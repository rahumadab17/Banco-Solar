const { Pool } = require('pg');

const config = {
    host: "127.0.0.1",
    port: 5432,
    database: "bancosolar",
    user: "postgres",
    password: "7804"
};

const pool = new Pool(config);

const nuevaTransferencia = async (emisor, receptor, monto) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const sustraccionEmisor = {
            text: "update usuarios set balance = balance - $2 where id = $1 RETURNING *;",
            values: [ emisor, monto ],
        }

        
        const adicionReceptor = {
            text: "update usuarios set balance = balance + $2 where id = $1 RETURNING *;",
            values: [ receptor, monto ],
        }
        
        const registroTransferencia = {
            text: "insert into transferencias (emisor, receptor, monto) values ($1, $2, $3);",
            values: [ emisor, receptor, monto ],
        }

        const resultEmisor = await client.query(sustraccionEmisor);
        const resultReceptor = await client.query(adicionReceptor);
        await client.query(registroTransferencia);

        await client.query("COMMIT");

        return { emisor: resultEmisor.rows[0], receptor: resultReceptor.rows[0] };
    } catch (error) {
        await client.query("ROLLBACK");
        const { code } = error;
        console.log(`No ha sido posible hacer la transacción debido al código de error: ${code}`);
    } finally {
        client.release();
    }
};

const obtenerTransferencias = async () => {
    const result = await pool.query("select * from transferencias;");
    return result.rows;
};

module.exports = { nuevaTransferencia, obtenerTransferencias }