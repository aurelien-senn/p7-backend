const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

//creation new user
exports.signup = (req, res, next) => {

    const Data = req.body;


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
                console.log('sans image');
                console.log(user);
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
                console.log('avec image');
                console.log(user);
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }






}

exports.login = (req, res, next) => {
    const Data = JSON.parse(req.body.data);
    console.log(req.body.data);
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
                        prenom: user.prenom,
                        nom: user.nom,
                        imageUrl: user.imageUrl,
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
