var User = require('../models/userModel');
var Encrypt = require('../util/encrypt');

module.exports = function (app) {

    app.get('/user', function (req, res) {
        User.find({}, 'user password name following followers', function (err, user) {
            if (err) {
                res.json(null);
            } else {
                res.json(user);
            }
        });
    });

    app.get('/user/followers', function (req, res) {
        User.find({ "_id": req.query.idFollowed }, 'followers', function (err, users) {
            if (err || !users[0] || !users[0].followers) {
                res.json(null);
            } else {
                users[0].followers.forEach(user => {
                    if (user.idUser == req.query.idFollowed) {
                        user['followed'] = true;
                    }
                });
                res.json(users[0].followers);
            }
        }).lean();
    });

    app.get('/user/following', function (req, res) {
        User.find({ "_id": req.query.idFollower }, 'following', function (err, users) {
            if (err || !users[0] || !users[0].following) {
                res.json(null);
            } else {
                users[0].following.forEach(user => {
                    user['followed'] = true;
                });
                res.json(users[0].following);
            }
        }).lean();
    });


    app.get('/user/login', function (req, res) {
        const login = req.query.login;
        const password = Encrypt.encrypt(req.query.password);
        User.findOne({ "login": login, "password": password }, 'login name', function (err, user) {
            if (err || !user) {
                res.json({ "success": false, "errors": err });
            } else {
                res.json({ "success": true, "data": { "name": user.name, "id": user._id } });
            }
        });
    });

    app.get('/user/findByName', function (req, res) {
        try {
            User.find({ 'name': new RegExp(req.query.name, 'i'), '_id': { $ne: req.query.idUser } }, 'name followers', function (err, response) {
                if (err) {
                    res.end();
                }
                response.forEach(user => {
                    const exists = user.followers.some(item => item.idUser == req.query.idUser);
                    user['followed'] = exists;
                });
                res.json(response);
            }).lean();
        } catch (err) {
            res.end();
        }
    });

    app.post('/user', function (req, res) {
        const pass = Encrypt.encrypt(req.body.password);
        var user = new User({ 'login': req.body.login, "password": pass, name: req.body.name });
        user.save(function (err) {
            if (err) {
                // Duplicate username (erro: 11000)
                return res.status(400).send({ succes: false, "errors": [err.code] });
            }
            res.json({ success: true });
        });
    });


    app.post('/user/follow', function (req, res) {
        User.findOne({ "_id": req.body.idFollowed }, function (err, name) {
            User.findOneAndUpdate({ "_id": req.body.idFollower },
                { $push: { following: { "idUser": req.body.idFollowed, "name": name.name } } }, function (err, follower) {
                    if (!err) {
                        User.findOneAndUpdate({ "_id": req.body.idFollowed },
                            { $push: { followers: { "idUser": follower._id, "name": follower.name } } }, function (err, followed) {
                                if (!err) {
                                    res.json({ success: true });
                                }
                            });
                    }
                });
        });
    });

    app.delete('/user/unfollow', function (req, res) {
        User.findOne({ "_id": req.body.idUnfollowed }, function (err, name) {
            if (name) {
                User.findOneAndUpdate({ "_id": req.body.idUnfollower },
                    { $pull: { following: { "idUser": req.body.idUnfollowed, "name": name.name } } }, function (err, unfollower) {
                        if (!err && unfollower) {
                            User.findOneAndUpdate({ "_id": req.body.idUnfollowed },
                                { $pull: { followers: { "idUser": unfollower._id, "name": unfollower.name } } }, function (err, unfollowed) {
                                    if (!err) {
                                        res.json({ success: true });
                                    }
                                });
                        } else {
                            res.json({ success: false });
                        }
                    });
            } else {
                res.json({ succes: false });
            }
        });
    });
}