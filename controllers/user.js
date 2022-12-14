const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

//creation new user
exports.signup = (req, res, next) => {
    const Data = req.body.data;
    if (typeof req.file == 'undefined') {
        bcrypt.hash(Data.password, 10)
            .then(hash => {
                var user = new User({
                    email: Data.email,
                    password: hash,
                    nom: Data.nom,
                    prenom: Data.prenom,
                    imageUrl: "http://localhost:3000/images/image.png",
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        bcrypt.hash(Data.password, 10)
            .then(hash => {
                var user = new User({
                    email: Data.email,
                    password: hash,
                    nom: Data.nom,
                    prenom: Data.prenom,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }






}

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
                        admin: user.admin,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '200h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
exports.navbar = (req, res, next) => {



    User.findOne({ _id: req.auth.userId })
        .then(user => {

            res.status(200).json({
                userId: user._id,
                nom: user.nom,
                prenom: user.prenom,
                imageUrl: user.imageUrl

            })
        })
        .catch(error => res.status(501).json({ error }));
}

