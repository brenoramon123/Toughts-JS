const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "Breno123@", {
    host: "localhost",
    dialect: "mysql",
    port: 3306 // Ajuste se necessário
});


try {
    sequelize.authenticate()
    console.log("conectado com sucesso")
    
} catch (error) {
    console.log(error.message)
}

module.exports = sequelize