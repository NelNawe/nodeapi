const { FavoriteModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.delete('/api/favorites/:userId/:monumentId', async (req, res) => {
        const { userId, monumentId } = req.params;

        try {
            // Vérifier si le favori existe
            const favorite = await FavoriteModel.findOne({
                where: { userId, monumentId }
            });

            if (!favorite) {
                return res.status(404).json({ 
                    message: "Ce monument n'est pas dans vos favoris", 
                    data: null 
                });
            }

            // Supprimer le favori
            await favorite.destroy();

            const message = `Le monument a été retiré de vos favoris.`;
            res.json({ message, data: null });

        } catch (error) {
            const message = "Le favori n'a pas pu être supprimé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};
