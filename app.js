const express = require('express');
const chalk = require('chalk');
const { insertarUsuario, eliminarUsuario, obtenerUsuarios } = require('./queries.js');
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
        console.log(chalk.redBright.bold(`No se pudo insertar al usuario debido al error N°: ${code}`));
        console.log(error);
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const result = await obtenerUsuarios();
        res.json(result);
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo encontrar las canciones debido al error N°: ${code}`));
    }
});

app.put("/usuario", async (req, res) => {

});

app.delete("/usuario", async (req, res) => {
    try {
        const { id } = req.query
        const result = await eliminarUsuario(id)
        res.json(result)
    } catch (error) {
        const { code } = error;
        console.log(chalk.redBright.bold(`No se pudo eliminar el usuario debido al error N°: ${code}`));
    }
});

app.post("/transferencia", async (req, res) => {

});

app.get("/transferencias", async (req, res) => {

});