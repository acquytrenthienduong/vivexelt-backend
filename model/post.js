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
        short_description: {
            type: Sequelize.STRING
        },
        link_video: {
            type: Sequelize.STRING
        },
        image_thumbnail: {
            type: Sequelize.STRING
        },
        seoTitle: {
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
        tableName: 'post',
        timestamps: false
    });

    return Post;
};