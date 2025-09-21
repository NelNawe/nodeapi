const { FavoriteModel, MonumentModel, UserModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/favorites', async (req, res) => {
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

            // Récupérer les favoris de l'utilisateur connecté
            const favorites = await FavoriteModel.findAll({
                where: { userId: user.id }
            });

            // Récupérer les détails des monuments pour chaque favori
            const favoritesWithMonuments = await Promise.all(
                favorites.map(async (favorite) => {
                    const monument = await MonumentModel.findByPk(favorite.monumentId);
                    return {
                        id: favorite.id,
                        monumentId: favorite.monumentId,
                        createdAt: favorite.created,
                        monument: monument
                    };
                })
            );

            const message = `Vos monuments favoris ont été récupérés.`;
            res.json({ message, data: favoritesWithMonuments });

        } catch (error) {
            const message = "Les favoris n'ont pas pu être récupérés. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
