const express = require('express');
const chalk = require('chalk')
const app = express();

const port = 3000;

app.listen(port, console.log(chalk.greenBright.bold(`Server ON in port ${port}`)));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});