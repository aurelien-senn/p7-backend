const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//creation new user
exports.signup = (req, res, next) => {

    const Data = JSON.parse(req.body.data);
    console.log(Data.email);
    bcrypt.hash(Data.password, 10)

        .then(hash => {
            const user = new User({
                email: Data.email,
                password: hash
            });
            console.log(user);
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
exports.login = (req, res, next) => {
    const Data = JSON.parse(req.body.data);
    User.findOne({ email: Data.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(Data.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
