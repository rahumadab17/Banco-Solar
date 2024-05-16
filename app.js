const express = require('express');
const chalk = require('chalk');
const { insertarUsuario, eliminarUsuario, obtenerUsuarios, editarUsuario } = require('./queriesUsuarios.js');
const { nuevaTransferencia, obtenerTransferencias } = require('./queriesTransferencias.js');
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
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo insertar al usuario debido al error: ${code}`));
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const result = await obtenerUsuarios();
        res.json(result);
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo encontrar los usuarios debido al error: ${code}`));
    }
});

app.put("/usuario", async (req, res) => {
    try {
        const { id } = req.query;
        const { nombre, balance } = req.body

        const result = await editarUsuario(id, nombre, balance);
        res.json(result)
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo editar al usuario debido al error: ${code}`));
    }
});

app.delete("/usuario", async (req, res) => {
    try {
        const { id } = req.query
        const result = await eliminarUsuario(id)
        res.json(result)
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo eliminar el usuario debido al error: ${code}`));
    }
});

app.post("/transferencia", async (req, res) => {
    try {
        const { emisor, receptor, monto } = req.body;

        const result = await nuevaTransferencia(emisor, receptor, (monto));
        res.json(result)
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo realizar la transferencia debido al error: ${code}`));
    }
});

app.get("/transferencias", async (req, res) => {
    try {
        const result = await obtenerTransferencias();
        res.json(result);
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo encontrar el registro de transferencias debido al error: ${code}`));
    }
});