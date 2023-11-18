const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const downloadLog = sequelize.define('downloadLogs', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fileName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    filePath:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fileSize: {
        type: Sequelize.INTEGER,
    },
    fileType: {
        type: Sequelize.STRING,
    }
});

module.exports = downloadLog;
