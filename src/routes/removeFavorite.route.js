const { FavoriteModel, MonumentModel, UserModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.delete('/api/favorites/:monumentId', async (req, res) => {
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

            // Vérifier si le favori existe
            const favorite = await FavoriteModel.findOne({
                where: { userId: user.id, monumentId }
            });

            if (!favorite) {
                return res.status(404).json({ 
                    message: "Ce monument n'est pas dans vos favoris", 
                    data: null 
                });
            }

            // Supprimer le favori
            await favorite.destroy();

            const message = `Le monument "${monument.title}" a été retiré de vos favoris.`;
            res.json({ message, data: null });

        } catch (error) {
            const message = "Le favori n'a pas pu être supprimé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
