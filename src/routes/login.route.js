const { UserModel } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./src/auth/jwtRS256.key');
const { handleError } = require('../helper');

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Le nom d'utilisateur et le mot de passe sont requis", 
                data: null 
            });
        }

        try {
            // Vérification si l'utilisateur existe
            const user = await UserModel.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé", data: null });
            }

            // Vérification du mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Mot de passe incorrect", data: null });
            }

            // Génération du token JWT
            const token = jwt.sign(
                { userName: user.username }, 
                privateKey, 
                { algorithm: 'RS256', expiresIn: '1h' }
            );

            return res.json({ 
                message: "Authentification réussie", 
                data: { userId: user.id, token } 
            });

        } catch (error) {
            message = 'Erreur lors de l\'authentification'
            return handleError(res, error, message);
        }
    });
};
