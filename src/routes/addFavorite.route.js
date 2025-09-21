const { FavoriteModel, UserModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.post('/api/favorites/:monumentId', async (req, res) => {
        const { monumentId } = req.params;
        const username = req.user.userName; // Utilisateur connecté depuis le middleware auth

        try {
            // Récupérer l'utilisateur par son nom d'utilisateur
            const user = await UserModel.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ 
                    message: "Utilisateur non trouvé", 
                    data: null 
                });
            }

            // Vérifier que le monument existe
            const monument = await MonumentModel.findByPk(monumentId);
            if (!monument) {
                return res.status(404).json({ 
                    message: "Monument non trouvé", 
                    data: null 
                });
            }

            // Vérifier si le favori existe déjà
            const existingFavorite = await FavoriteModel.findOne({
                where: { userId: user.id, monumentId }
            });

            if (existingFavorite) {
                return res.status(409).json({ 
                    message: "Ce monument est déjà dans vos favoris", 
                    data: null 
                });
            }

            // Créer le favori
            const favorite = await FavoriteModel.create({ userId: user.id, monumentId });

            const message = `Le monument "${monument.title}" a été ajouté aux favoris.`;
            res.status(201).json({ message, data: favorite });

        } catch (error) {
            const message = "Le favori n'a pas pu être créé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
