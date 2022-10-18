const Thing = require('../models/thing');
const fs = require('fs');


exports.createThing = (req, res, next) => {



    if (typeof req.file == 'undefined') {
        var thing = new Thing({
            ...req.body,
            userId: req.auth.userId,

        });

    } else {

        var thing = new Thing({
            ...req.body,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        });
    }


    thing.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifyThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {

            if (thing.userId != req.auth.userId && thing.admin === false) {
                res.status(401).json({ message: 'Not authorized ' });

            } else {
                if (typeof req.file == 'undefined') {


                    const thing = new Thing({
                        _id: req.params.id,
                        title: req.body.title,
                        description: req.body.description,


                    });
                    Thing.updateOne({ _id: req.params.id }, thing).then(
                        () => {
                            res.status(201).json({
                                message: 'Thing updated successfully!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                } else {


                    const thing = new Thing({
                        _id: req.params.id,
                        title: req.body.title,
                        description: req.body.description,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

                    });
                    Thing.updateOne({ _id: req.params.id }, thing).then(
                        () => {
                            res.status(201).json({
                                message: 'Thing updated successfully!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                }
            }
        })
}

exports.deleteThing = (req, res, next) => {

    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            if (thing.userId != req.auth.userId && thing.admin === false) {
                res.status(401).json({ message: 'Not authorized ' });
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
exports.likeThing = (req, res) => {
    console.log(req.body.like);
    if (req.body.like === 1) {
        Thing.updateOne({ _id: req.params.id }, {
            $inc: { likes: req.body.like++ },
            $push: { usersLiked: req.body.userId },
        }
        )
            .then((thing) => res.status(200).json({ message: "like" }))
            .catch((error) => res.status(400).json({ error }));
    }


    else if (req.body.like === -1) {
        Thing.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: req.body.like++ * -1 },
                $push: { usersDisliked: req.body.userId },
            }
        )
            .then((thing) =>
                res.status(200).json({ message: "dislike" })
            )
            .catch((error) => res.status(400).json({ error }));
    }

    else if (req.body.like === 0) {
        Thing.findOne({ _id: req.params.id })
            .then((thing) => {
                if (thing.usersLiked.includes(req.body.userId)) {
                    Thing.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
                    )
                        .then((thing) => {
                            res.status(200).json({ message: "supp like" });
                        })
                        .catch((error) => res.status(400).json({ error }));
                } else if (thing.usersDisliked.includes(req.body.userId)) {
                    Thing.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 },
                        }
                    )
                        .then((thing) => {
                            res.status(200).json({ message: "supp dislike" });
                        })
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};

