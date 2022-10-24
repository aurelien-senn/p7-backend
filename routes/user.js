const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user')
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/navbar', auth, userCtrl.navbar);
module.exports = router;