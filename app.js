const express = require('express');
const chalk = require('chalk');
const { insertarUsuario, eliminarUsuario, obtenerUsuarios, editarUsuario } = require('./queriesUsuarios.js');
const { nuevaTransferencia, obtenerTransferencias, balanceEmisorCheck } = require('./queriesTransferencias.js');
const app = express();

const port = 3000;

app.listen(port, console.log(chalk.greenBright.bold(`Server ON in port ${port}`)));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.post("/usuario", async (req, res) => {
    try {
        const { nombre, balance } = req.body;

        const result = await insertarUsuario(nombre, balance);
        res.json(result)
    } catch (error) {
        res.status(500).send("No ha sido posible agregar al usuario" + error);
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const result = await obtenerUsuarios();
        res.json(result);
    } catch (error) {
        res.status(500).send("No ha sido posible mostrar el registro de usuarios." + error);
    }
});

app.put("/usuario", async (req, res) => {
    try {
        const { id } = req.query;
        const { nombre, balance } = req.body

        const result = await editarUsuario(id, nombre, balance);
        res.json(result)
    } catch (error) {
        res.status(500).send("No ha sido posible editar al usuario" + error);
    }
});

app.delete("/usuario", async (req, res) => {
    try {
        const { id } = req.query
        const result = await eliminarUsuario(id)
        res.json(result)
    } catch (error) {
        res.status(500).send("No ha sido posible eliminar al usuario" + error);
    }
});

//*INTENTO DE MENSAJE DE ALERTA "BALANCE INSUFICIENTE"

/* app.use("/transferencia", async (req, res, next) => {
    const { emisor, monto } = req.body;

    const balanceEmisor = await balanceEmisorCheck(emisor);

    if ((balanceEmisor - monto) < 0) {
        return res.status(400).json({
            error: `El balance del emisor: "${emisor}" es insuficiente para realizar la transacción`
        });
    } else {
        next();
    }
}) */

app.post("/transferencia", async (req, res) => {
    try {
        const { emisor, receptor, monto } = req.body;

        const result = await nuevaTransferencia(emisor, receptor, monto);
        res.send(result)
    } catch (error) {
        res.status(500).send("No ha sido posible realizar la transferencia" + error);
    }
});

app.get("/transferencias", async (req, res) => {
    try {
        const result = await obtenerTransferencias();
        res.json(result);
    } catch (error) {
        res.status(500).send("No ha sido posible mostrar el registro de transferencias" + error);
    }
});