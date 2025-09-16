const { MonumentModel } = require('../db/sequelize');

module.exports = (app) => {
    app.delete('/monuments/:id', (req, res) => {
        const id = parseInt(req.params.id);

        return MonumentModel.findByPk(id).then(monument => {
            if(monument === null){
                const message = `Le monument avec l'ID ${id} n'existe pas.`
                return res.status(404).json({message, data: null})
            }

            return MonumentModel.destroy({
                where: { id: id }
            })
            .then(_ => {
                const message = `Le monument avec l'ID ${id} a bien été supprimé.`
                res.json({message, data: monument})
            })
        })
        .catch(error => {
            const message = "Le monument n'a pas pu être supprimé. Réessayez dans quelques instants."
            return res.status(500).json({ message, data: error })
        });
    });
}
