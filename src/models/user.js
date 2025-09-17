module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: "Le nom d'utilisateur est requis" },
                notEmpty: { msg: "Le nom d'utilisateur ne peut pas être vide" },
                len: { args: [3, 25], msg: "Le nom d'utilisateur doit contenir entre 3 et 25 caractères" }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "Le mot de passe est requis" },
                notEmpty: { msg: "Le mot de passe ne peut pas être vide" },
                len: { args: [6, 100], msg: "Le mot de passe doit contenir au moins 6 caractères" },
            },
        },
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
    });
};