const { UserModel } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./src/auth/jwtRS256.key');

module.exports = (app) => {
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Le nom d'utilisateur et le mot de passe sont requis", data: null });
        }

        UserModel.findOne({ where: { username } })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: "Utilisateur non trouvé", data: null });
                }
                
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(401).json({ message: "Mot de passe incorrect", data: null });
                        }
                        
                        const token = jwt.sign( 
                            { userName: user.username },
                            privateKey,
                            { algorithm: 'RS256', expiresIn: '1m' }
                        );

                        res.json({ message: "Authentification réussie", data: { userId: user.id, token } });
                    })
            })
            .catch(err => {
                console.error('Erreur lors de la recherche de l\'utilisateur:', err);
                res.status(500).json({ message: "Erreur serveur", data: null });
            });
    });
};