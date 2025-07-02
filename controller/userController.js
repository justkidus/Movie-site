const express = require('express');
const User = require('../model/userModel');
const Profile = require('../model/profileModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(401).json({
				success: false,
				msg: 'missing a field',
			});
		}
		const existingUser = await User.findOne({
			$or: [{ username }, { email }],
		});
		if (existingUser) {
			return res.status(401).json('user already exists');
		}
		const hash = bcrypt.hashSync(req.body.password, 10);
		const newUser = await User({
			username: req.body.username,
			email: req.body.email,
			password: hash,
		});
		if (!existingUser) {
			await newUser.save();
			return res
				.status(201)
				.json({ success: true, msg: 'user registerd successuly ' });
		}
	} catch (error) {
		throw error;
	}
};
const Login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			res.status(401).json('All field are required');
		}
		const user = await User.findOne({
			username: req.body.username,
		});
		if (!user) {
			return res.status(401).json({
				success: false,
				mes: 'user is not found',
			});
		}
		const isPasswordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!isPasswordCorrect) {
			return res.status(401).json({
				success: false,
				msg: 'input invalid',
			});
		}
		//generate a JWT token
		const token = jwt.sign(
			{ _id: user._id, isAdmin: user.isAdmin },
			process.env.SECRET_KEY,
			{ expiresIn: '30d' }
		);

		const { password: _, isAdmin, ...otherDetails } = user._doc;
		res
			.cookie('access_token', token, {
				httpOnly: false,
				// secure: none,// this only work in HTTPS
				sameSite: 'strict', // this work if the backend and frontend working on the same port
			})
			.status(200)
			.json({ ...otherDetails });
	} catch (error) {
		throw error;
	}
};

const getUserProfile = async (req, res, next) => {
	try {
		const userId = req.user._id;
		console.log('Authenticated user id', userId);
		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: 'Hotel not found' });
		}
		const list = await Promise.all(
			user.profiles.map((profile) => {
				return Profile.findById(profile);
			})
		);
		res.status(200).json(list);
	} catch (error) {
		next(error);
	}
};

//update watch progress
const updateWatchProgress = async (req, res, next) => {
	try {
		const { movieId, progress, totalDuration } = req.body;
		const updatedProfile = await Profile.findOneAndUpdate(
			{
				_id: req.params.profileId,
				'watchedMovies.movieId': movieId,
			},
			{
				$set: {
					'watchedMovies.$.progress': progress,
					'watchedMovies.$.lastWatched': Date.now(),
					'watchedMovies.$.totalDuration': totalDuration,
				},
			},
			{ new: true }
		);
		if (!updatedProfile) {
			// If movie not in history, add it
			const profile = await Profile.findByIdAndUpdate(
				req.params.profileId,
				{
					$addToSet: {
						watchedMovies: {
							movieId,
							progress,
							totalDuration,
							lastWatched: Date.now(),
						},
					},
				},
				{ new: true }
			);
			return res.status(200).json(profile);
		}
		res.status(200).json(updatedProfile);
	} catch (error) {
		throw error;
	}
};
// get the watch history
const watchHistory = async () => {
	try {
		const profile = await Profile.findById(req.params.profileId).populate(
			'watchedMovies.movieId'
		);
		res.status(200).json(profile.watchedMovies);
	} catch (error) {
		throw error;
	}
};
const checkAuth = async (req, res) => {
	try {
		res.status(200).json(req.user);
		console.log('uer is authenticated ', req.user);
	} catch (error) {
		throw error;
	}
};
module.exports = {
	Register,
	Login,
	getUserProfile,
	watchHistory,
	updateWatchProgress,
	checkAuth,
};
