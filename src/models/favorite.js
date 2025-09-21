module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Favorite', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' }
        },
        monumentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Monuments', key: 'id' }
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
    });
};
