const { FavoriteModel, UserModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.get('/api/favorites/monument/:monumentId', async (req, res) => {
        const { monumentId } = req.params;

        try {
            // Vérifier que le monument existe
            const monument = await MonumentModel.findByPk(monumentId);
            if (!monument) {
                return res.status(404).json({ 
                    message: "Monument non trouvé", 
                    data: null 
                });
            }

            // Récupérer les utilisateurs qui ont ce monument en favori
            const favorites = await FavoriteModel.findAll({
                where: { monumentId }
            });

            // Récupérer les détails des utilisateurs pour chaque favori
            const favoritesWithUsers = await Promise.all(
                favorites.map(async (favorite) => {
                    const user = await UserModel.findByPk(favorite.userId);
                    return {
                        ...favorite.toJSON(),
                        user: user
                    };
                })
            );

            const message = `Les utilisateurs ayant ce monument en favori ont été récupérés.`;
            res.json({ message, data: favoritesWithUsers });

        } catch (error) {
            const message = "Les favoris n'ont pas pu être récupérés. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
