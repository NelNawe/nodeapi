const { MonumentModel } = require('../db/sequelize');

module.exports = (app) => {
    app.post('/monuments', (req, res) => {
        MonumentModel.create(req.body)
            .then(monument => {
                const message = `Le monument ${monument.title} a bien été créé.`
                res.json({ message, data: monument })
            })
            .catch(error => {
                const message = "Le monument n'a pas pu être créé. Réessayez dans quelques instants."
                return res.status(500).json({ message, data: error })
            });
    });
}   