module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("image", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        path: {
            type: Sequelize.STRING
        },
        position: {
            type: Sequelize.STRING
        },
        filename: {
            type: Sequelize.STRING
        },
        createAt: {
            type: Sequelize.DATE
        }
    }, {
        sequelize,
        tableName: 'image',
        timestamps: false
    });

    return Image;
};