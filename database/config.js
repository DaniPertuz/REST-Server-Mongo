const mongoose = require('mongoose');
require('colors')

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos en línea'.cyan);
    } catch (error) {
        console.error(error);
        throw new Error('Error en conexión a BD'.red);
    }
}

module.exports = {
    dbConnection
}