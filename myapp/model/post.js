module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        linkvideo: {
            type: Sequelize.STRING
        }
    }, {
        sequelize,
        tableName: 'post',
        timestamps: false
    });

    return Post;
};