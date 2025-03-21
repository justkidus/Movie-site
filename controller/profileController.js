const express = require('express');
const Profile = require('../model/profileModel');
const User = require('../model/userModel');
const mongoose = require('mongoose');
const { Movie } = require('../model/watchProgress');

const createProfile = async (req, res, next) => {
	const userId = req.user._id;
	console.log(userId);
	try {
		const newProfile = new Profile(req.body);
		const savedProfile = await newProfile.save();
		try {
			await User.findByIdAndUpdate(userId, {
				$push: { profiles: savedProfile._id },
			});
		} catch (error) {
			next(error);
		}
		if (savedProfile > 3) {
			return res.status(401).json('Profiles can exceed 3 user');
		}
		if (savedProfile <= 3) {
			res.status(201).json(savedProfile);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

///////////////////////////////////////////
const getAProfile = async (req, res, next) => {
	try {
		const profile = await Profile.findById(req.params.id);
		res.status(200).json(profile);
	} catch (error) {
		throw error;
	}
};

const getProfile = async (req, res, next) => {
	try {
		const profile = await Profile.find();
		res.status(200).json(profile);
	} catch (error) {
		throw error;
	}
};

// const favouriteMovie=async(req,res,next)=>{
// const profileId=req.user.id
// 	try{
// 			const favMovie=new Movie(req.body)
// 	const savedMovie=await favMovie.save();
// await Profile.findByIdAndUpdate(profile)
// 	}catch{
// 		throw error;
// 	}
// }
module.exports = { getProfile, getAProfile, createProfile };
