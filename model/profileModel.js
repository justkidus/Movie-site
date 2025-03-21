const express = require('express');
const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		watchProgress: [
			{
				movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
				lastWatched: { type: Date, default: Date.now },
				progree: { type: Number, default: 0 },
				totalDuration: { type: Number, required: true },
			},
		],
		favMovie: [],
	},
	{
		timestamps: true,
	}
);
const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
