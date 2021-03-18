var express = require('express');
var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '71465810071-khfp2595tqtsgdft2c396o28ttbr8bat.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/login',(req,res) => {
  res.render('login');
})

router.post('/login',(req,res)=>{
  var token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log(payload);
  }
  verify().then(()=>{
    res.cookie('session-token',token);
    res.send('success')
  }).catch((err)=>{
    res.send(err);
  });
})

router.get('/protected',(req,res)=>{
  var token = req.cookies['session-token'];
  if(!token){
    res.redirect('/login');
    return;
  }
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log(payload);
  } 
  verify().then(()=>{
    res.render('protected');
  }).catch((err)=>{
    res.redirect('/login');
  })
})

router.get('/logout',(req,res)=>{
  res.clearCookie('session-token');
  res.redirect('/login');
})

module.exports = router;
