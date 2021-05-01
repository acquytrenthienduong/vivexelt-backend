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

    }, {
        sequelize,
        tableName: 'image',
        timestamps: false
    });

    return Image;
};