const express = require('express');
const {
	Register,
	Login,
	getUserProfile,
} = require('../controller/userController');
const verifyToken = require('../middlewear/verifyToken');
const router = express.Router();
//user Route

router.post('/register', Register);
router.post('/login', Login);

//Verify user

// router.get('/user/verifyUser/:id', veriyUser, (req, res) => {
// 	res.status(200).json({ msg: 'you are the user', user: req.user });
// });

//get all Profiles
router.get('/user/getprofiles/:id', verifyToken, getUserProfile);
module.exports = router;
