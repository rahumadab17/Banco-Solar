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

    const idEmisorQuery = await client.query(`select * from usuarios where nombre = '${emisor}'`)
    const idEmisor = idEmisorQuery.rows[0].id

    const idReceptorQuery = await client.query(`select * from usuarios where nombre = '${receptor}'`)
    const idReceptor = idReceptorQuery.rows[0].id

    try {
        await client.query("BEGIN");

        const sustraccionEmisor = {
            text: "update usuarios set balance = balance - $2 where id = $1 RETURNING *;",
            values: [ idEmisor, monto ],
        }

        const adicionReceptor = {
            text: "update usuarios set balance = balance + $2 where id = $1 RETURNING *;",
            values: [ idReceptor, monto ],
        }

        const registroTransferencia = {
            text: "insert into transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, now()) RETURNING *;",
            values: [ idEmisor, idReceptor, monto ],
        }

        const emisorResult = await client.query(sustraccionEmisor);
        const receptorResult = await client.query(adicionReceptor);
        const transferenciaResult = await client.query(registroTransferencia);

        await client.query("COMMIT");

        return {
            emisor: emisorResult.rows[0],
            receptor: receptorResult.rows[0],
            transferencia: transferenciaResult.rows[0],
        };
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

/*         const sustraccionEmisorQuery = "update usuarios set balance = balance - $2 where id = $1 RETURNING *;"
        const sustraccionValues = [ emisor, monto ];

        const adicionReceptorQuery = "update usuarios set balance = balance + $2 where id = $1 RETURNING *;"
        const adicionValues = [ receptor, monto ];

        const registroTransferencia = "insert into transferencias (emisor, receptor, monto) values ($1, $2, $3);"
        const registroValues = [ emisor, receptor, monto ]

        await client.query(sustraccionEmisorQuery, sustraccionValues);
        await client.query(adicionReceptorQuery, adicionValues);
        await client.query(registroTransferencia, registroValues); */