const express = require('express');
const {
	createProfile,
	getAProfile,
	getProfile,
} = require('../controller/profileController');
const verifyToken = require('../middlewear/verifyToken');
const {
	updateWatchProgress,
	watchHistory,
} = require('../controller/userController');
const profilerouter = express.Router();
// create a profile
profilerouter.post('/createprofile/:id', verifyToken, createProfile);
//get a profile
profilerouter.get('/getaprofile/:id', verifyToken, getAProfile);
//get all profiles
profilerouter.get('/getallprofile', getProfile);

//put update watch progress
profilerouter.put('/update/:profileId', verifyToken, updateWatchProgress);
//get watch history
profilerouter.get('/getwatch/:profileId', verifyToken, watchHistory);
module.exports = profilerouter;
