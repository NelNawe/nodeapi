const { FavoriteModel, UserModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/favorites/:userId', async (req, res) => {
        const { userId } = req.params;

        try {
            // Vérifier que l'utilisateur existe
            const user = await UserModel.findByPk(userId);
            if (!user) {
                return res.status(404).json({ 
                    message: "Utilisateur non trouvé", 
                    data: null 
                });
            }

            // Récupérer les favoris avec les détails des monuments
            const favorites = await FavoriteModel.findAll({
                where: { userId }
            });

            // Récupérer les détails des monuments pour chaque favori
            const favoritesWithMonuments = await Promise.all(
                favorites.map(async (favorite) => {
                    const monument = await MonumentModel.findByPk(favorite.monumentId);
                    return {
                        ...favorite.toJSON(),
                        monument: monument
                    };
                })
            );

            const message = `Les favoris de l'utilisateur ont été récupérés.`;
            res.json({ message, data: favoritesWithMonuments });

        } catch (error) {
            const message = "Les favoris n'ont pas pu être récupérés. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
