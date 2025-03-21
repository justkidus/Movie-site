const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/userRoute');
const profilerouter = require('./routes/profileRoutes');
dotenv.config();

const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB);
		console.log('DB CONNECTED SUCCESSFULLY');
	} catch (error) {
		throw error;
	}
};
// const allowedOrigins = ['http://localhost:5173'];
// app.use(
// 	cors({
// 		origin: allowedOrigins,
// 		credentials: true,
// 		methods: ['GET', 'PUT', 'POST', 'DELETE'],
// 		allowedHeaders: ['Content-Type', 'Authorization'],
// 	})
// );
app.use(
	cors({
		origin: 'http://localhost:5173', // Frontend URL
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieparser());

app.use('/auth', (req, res) => {
	res.send('hello user');
});
//user Route

app.use('/api', router);

// Proile Route
app.use('/api', profilerouter);
// app.use("/api",)

const port = process.env.PORT;
app.listen(port, () => {
	connect();
	console.log(`server is running http://localhost:${process.env.port}`);
});
// YXyxg9HdTh20g6zc;
