const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async(role = '') => {
    const roleExists = await Role.findOne({role});
    if(!roleExists) {
        throw new Error(`Rol ${role} no válido. Verifique nuevamente`);
    }
}

const emailExists = async(email = '') => {
    const validEmail = await User.findOne({email});
    if(validEmail) {
        throw new Error(`El correo ${email} ya existe`);
    }
}

const validUserID = async(id) => {
    const validUser = await User.findById(id);
    if(!validUser) {
        throw new Error(`El usuario ${id} no existe`);
    }
}

module.exports = {
    isRoleValid,
    emailExists,
    validUserID
}