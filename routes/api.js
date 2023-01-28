var express = require('express');
var router = express.Router();

const db = require('../models'); //contain the models
//delete all the saved images----------------------------------------------------------------

function authentication(req,res,next) {
    if(!req.session.logIn) {

        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        res.status(300).send();
    }else{
        req.session.session = req.session.id;
        next();
    }
}

router.post('/feed/comment', authentication,(req, res) => {

    db.Comments.create({
        email: req.body.email.trim().toString(),
        userName: req.body.userName.trim().toString(),
        image: req.body.image.trim().toString(),
        comment: req.body.comment.trim().toString(),
        }).then(() => {
            return res.status(200).send('saved');
        }).catch((err) => {
            console.log('*** error creating a comment', JSON.stringify(err))
            return res.status(400).send(err)
        });
});

router.post('/feed/getCommets',authentication, (req, res) => {
    db.Comments.findAll({where: {image: req.body.img}})
    .then((comments) => res.send(comments))
    .catch((err)=>{
        console.log('There was an error querying comment', JSON.stringify(err))
        return res.send(err)
    });
});

router.delete('/feed/deleteComment',authentication, (req, res) => {
    console.log(req.body.comment.trim().toString());
    return db.Comments.findOne({
        where: {
            image: req.body.image,
            comment: req.body.comment.trim().toString(),
            email: req.body.email,
        }}).then((comment) => comment.destroy({ force: true }))
        .then(() => res.status(200).send())
        .catch((err) => {
            console.log('***Error deleting a comment', JSON.stringify(err))
            res.status(400).send(err)
        })
}); 

module.exports = router;