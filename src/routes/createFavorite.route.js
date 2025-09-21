const { FavoriteModel, UserModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.post('/api/favorites', async (req, res) => {
        const { userId, monumentId } = req.body;

        try {
            // Vérifier que l'utilisateur existe
            const user = await UserModel.findByPk(userId);
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
                where: { userId, monumentId }
            });

            if (existingFavorite) {
                return res.status(409).json({ 
                    message: "Ce monument est déjà dans vos favoris", 
                    data: null 
                });
            }

            // Créer le favori
            const favorite = await FavoriteModel.create({ userId, monumentId });

            const message = `Le monument "${monument.title}" a été ajouté aux favoris.`;
            res.status(201).json({ message, data: favorite });

        } catch (error) {
            const message = "Le favori n'a pas pu être créé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
