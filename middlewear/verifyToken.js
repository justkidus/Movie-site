// const express = require('express');
// const jwt = require('jsonwebtoken');

// const verifytoken = async (req, res, next) => {
// 	const token = req.cookies.access_token;
// 	if (!token) {
// 		return res.status(401).json({ success: false, msg: 'token not found' });
// 	}

// 	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
// 		if (err) {
// 			return res.status(401).json({
// 				success: false,
// 				msg: 'token is not verified',
// 			});
// 		}
// 		req.user = user;
// 		if (user) {
// 			console.log('happy');
// 		}
// 		next();
// 	});
// };
// const veriyUser = (req, res, next) => {
// 	verifytoken(req, res, () => {
// 		if (req.user._id === req.params.id || req.user.isAdmin) {
// 			next();
// 		} else {
// 			return res.status(403).json({
// 				success: false,
// 				msg: 'you are not autheniticated',
// 			});
// 		}
// 	});
// };
// module.exports = { verifytoken, veriyUser };

//////////////////////////////////////
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
// 	// const token =
// 	// 	req.headers.authorization?.split(' ')[1] || req.cookies.access_token;
// 	const token = req.cookies.access_token;

// 	if (!token) return res.status(403).json({ error: 'Unauthorized' });

// 	try {
// 		const decoded = jwt.verify(token, process.env.SECRET_KEY);
// 		const userId = decoded._id; // Attach userId to request
// 		req.user = userId;
// 		next();
// 	} catch (error) {
// 		res.status(401).json({ error: 'Invalid Token' });
// 	}
// };
// module.exports = verifyToken;
///////////////////////////////////////////
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token;

	if (!token) {
		return res.status(403).json({ error: 'Unauthorized: No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = { _id: decoded._id }; // Attach as an object
		next();
	} catch (error) {
		res.status(401).json({ error: 'Invalid token' });
	}
};

module.exports = verifyToken;
