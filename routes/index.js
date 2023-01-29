var express = require('express');
const path = require('path');
const {use} = require("express/lib/router");
var router = express.Router();

var session = require('express-session');
const Cookies = require('cookies');
const keys = ['keyboard cat']

const db = require('../models');
const {Model} = require("sequelize");
const app = express();
const bcrypt = require('bcrypt');
router.use(session({ secret: 'somesecretkey'}))

function isEmailOccupied(mail) {
  return db.Users.count({ where: { email: mail } })
      .then(count => {
        if (count !== 0) {
          return false;
        }
        return true;
      });
}
function authentication(req,res,next){
  if(req.session.logIn) {

    res.render('feed', {title: 'Feed', userName: req.session.userName, email: req.session.email});
  }else {
    next();
  }
}
/* GET home page. */
router.get('/', authentication,(req,res)=> {
  res.render('Login', {title: 'Login', error: '', registrationMsg: ''})
});

router.post('/', function (req, res, next) {
  const cook = new Cookies(req, res, {keys: keys})
  if(req.session.logIn)
    req.session.logIn=false;
  const registerCookie = cook.get('RegisterCookie', {signed: true});
  if (!registerCookie) {
    req.session.registerSuccess = false;
    res.render('login', {
      title: 'Login',
      error:'Registration failed. Please try again faster',
      registrationMsg: ''
    })
  } else
  {
    bcrypt.genSalt(10, (err, salt) => {

      // Hash the password using the salt
      bcrypt.hash(req.body.password.trim(), salt, (err, hash) => {
        if (err) {
          return res.status(500).send(err);
        }
        db.Users.findOrCreate(
            {where: {email: req.body.email.trim()},
              defaults:{firstName:req.body.firstName.trim(),
                lastName:req.body.lastName.trim(),
                password: hash}})
            .then((created) => {
              if(created[1])
                res.render('login', {title: 'Login', registrationMsg:'registeration successful',error:''});
              else
                res.render('login', {title: 'Login', error:'registration failed, try again',registrationMsg:''});
            }).catch(function(error) {
          res.render('login', {title: 'Login', error:'', registrationMsg: ''})
        });
      });
    });
  }
});

router.get('/feed', authentication, (req, res) => {
  if (req.session.logIn)
    res.render('feed', {title: 'Feed', userName: req.session.userName, email: req.session.email});
  else
    res.render('login', {title: 'Login', error: 'Please login before proceeding',registrationMsg:''})
});

router.post('/feed', function(req, res, next) {

  //, password:
  return db.Users.findOne({where: {email: req.body.email.trim()}}).then((uname)=>{
    bcrypt.compare( req.body.password.trim(), uname.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!isMatch) {
        return res.render('login',{title: 'Login', error:'invalid Password',registrationMsg:''});
      }
      req.session.logIn=true;
      req.session.email = uname.email;
      req.session.userName = uname.firstName;
      res.render('feed',{title: 'Feed', userName: uname.firstName, email:uname.email});
    });

  }).catch((err)=>{
    res.render('login', { title: 'Login', error: 'Mail or password incorrect',registrationMsg:'' });
  });

});

router.get('/register',  authentication,(req,res)=> {
    res.render('register', {title: 'Register', error: 'your session has ended, please login again'});
});

router.get('/login', (req, res, next)=>{
  //finish session
  req.session.end;
  req.session.logIn = false;
  res.render('login',{title:'Login',error:'', registrationMsg: ''});
});

router.post('/register', function(req, res, next) {
  res.render('register', { title: 'Register', error: '' });
});

router.get('/enterPassword', function(req, res, next) {
  res.render('enterPassword', { title: 'Set Password' });
});

router.post('/enterPassword', function(req, res, next) {
  const cookies = new Cookies(req, res, { keys: keys })
  let mail = req.body.email.trim();
  isEmailOccupied(mail).then(isUnique => {
    if (isUnique) {
      req.session.registerSuccess =true;
      cookies.set('RegisterCookie', new Date().toISOString(), { maxAge: 30 * 1000 });
      res.render('enterPassword', {title: 'Set Password', mail: mail, firstName: req.body.firstName, lastName: req.body.lastName});

    }else {
      req.session.registerSuccess = false;
      res.render('register', {title: 'Register', error: 'this email is already in use'});
    }
  });
});

module.exports = router;
