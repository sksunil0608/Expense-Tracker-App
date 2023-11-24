const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Forgotpassword = sequelize.define('forgot_password', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expires_by: Sequelize.DATE
})

module.exports = Forgotpassword;