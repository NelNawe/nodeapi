const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
let monuments = require('./monuments-list')

const dbName = process.env.DB_NAME || 'monumento';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || 'root';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || 8889);
const dbDialect = process.env.DB_DIALECT || 'mysql';
const dbLogging = (process.env.DB_LOGGING || 'true') === 'true';

const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPass,
    {
        host: dbHost,
        port : dbPort,
        dialect: dbDialect,
        logging: dbLogging
    }
);

sequelize
        .authenticate()
        .then(() => {
            console.log('La connexion à la base de données a été établie avec succès.');
        })
        .catch(err => {
            console.error('Impossible de se connecter à la BDD:', err);
        });

const MonumentModel = require('../models/monument')(sequelize, DataTypes);
const UserModel = require('../models/user')(sequelize, DataTypes);
const AnecdoteModel = require('../models/anecdote')(sequelize, DataTypes);
const FavoriteModel = require('../models/favorite')(sequelize, DataTypes);

// Relations One-to-Many (Monument -> Anecdotes)
MonumentModel.hasMany(AnecdoteModel, { foreignKey: 'monument_id', as: 'anecdotes' }); 
AnecdoteModel.belongsTo(MonumentModel, { foreignKey: 'monument_id', as: 'monument' });

// Relations Many-to-Many (User <-> Monument via Favorite)
UserModel.belongsToMany(MonumentModel, {
    through: FavoriteModel,
    foreignKey: 'userId',
    otherKey: 'monumentId',
    as: 'favorites'
});

MonumentModel.belongsToMany(UserModel, {
    through: FavoriteModel,
    foreignKey: 'monumentId',
    otherKey: 'userId',
    as: 'favoritedBy'
});

const initDb = async () => {
    return sequelize.sync()
            .then(() => {
        
                monuments.forEach(async (monument) => {
                    MonumentModel.create({
                        title: monument.name,
                        country: monument.country,
                        city: monument.city,
                        buildYear: monument.buildYear,
                       picture: monument.picture,
                      description: monument.description
                    })
                 })
                console.log("Les modèles ont été synchronisés avec la base de données.");
        
            })
            .catch((error) => {
                console.error("Une erreur s'est produite lors de la synchronisation des modèles :", error);
            });
}

module.exports = {
    initDb,
    MonumentModel,
    UserModel,
    AnecdoteModel,
    FavoriteModel
};