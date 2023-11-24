const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const Downloadlog = sequelize.define('download_log', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    file_path:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    file_url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    file_size: {
        type: Sequelize.INTEGER,
    },
    file_type: {
        type: Sequelize.STRING,
    }
});

module.exports = Downloadlog;
