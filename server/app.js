const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./configs/database_connection");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const PORT = 3001;

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

// Conectando e criando tabelas:
const {createTables} = require("./database/tables");

connection.connect((error) => {
    if (error) throw error;
    createTables(connection)
})

// Rotas:
const fileRoutes = require("./routes/filesRoutes");
const graphRoutes = require("./routes/datasGraphRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Aplicação de rotas:
app.use("/file", fileRoutes);
app.use("/graph", graphRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log("app is running...")
})