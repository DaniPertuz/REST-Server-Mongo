const { User, Category, Role, Product } = require('../models');

const isRoleValid = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`Rol ${role} no válido. Verifique nuevamente`);
    }
}

const emailExists = async (email = '') => {
    const validEmail = await User.findOne({ email });
    if (validEmail) {
        throw new Error(`El correo ${email} ya existe`);
    }
}

const validUserID = async (id) => {
    const validUser = await User.findById(id);
    if (!validUser) {
        throw new Error(`El usuario ${id} no existe`);
    }
}

const categoryExists = async (id) => {
    const validCategory = await Category.findById(id);
    if (!validCategory) {
        throw new Error(`La categoría ${id} no existe`);
    }
}

const productExists = async (id) => {
    const validProduct = await Product.findById(id);
    if (!validProduct) {
        throw new Error(`El producto ${id} no existe`);
    }
}

const validCollections = (col = '', collections = []) => {
    const included = collections.includes(col);
    if (!included) {
        throw new Error(`La colección ${col} no es válida. ${collections}`);
    }

    return true;
}

module.exports = {
    isRoleValid,
    emailExists,
    validUserID,
    categoryExists,
    productExists,
    validCollections
}