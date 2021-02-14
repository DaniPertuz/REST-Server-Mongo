const { Schema, model } = require('mongoose');

const roleSchema = Schema({
    role: {
        type: String,
        required: [true, 'Rol no válido']
    }
});

module.exports = model('Role', roleSchema);