const express = require('express');
const path =require('path');
var sequelize = require('sequelize');

const app = express();
app.use(express.static(path.join(__dirname,'public')));

const User = require('./data/models/users');
const Channal = require('./data/models/channals');
const ChannalUser = require('./data/models/channal_users');

app.get('/hello', (req,res) =>{
	res.send('Its working');
})

// Admin add new User
app.post('/addUser', async(req,res) => {
	let newUser = await User.create({
		name: req.query.name
	})
	res.send(newUser);
})

// Create a Channal
app.post('/addChannal', async(req,res) => {
	let newChannal = await Channal.create({
		name: req.query.name,
		channal_desc: req.query.channal_desc
	})
	res.send(newChannal);
})

// Add users to channal
app.post('/addUserChannal', async(req,res) => {
	let chackChannal = await Channal.findOne({where:{id: req.query.channal_id}})
	if (chackChannal) 
	{
		let addUC = await ChannalUser.create({
			channal_id: chackChannal.id,
			user_id : req.query.user_id
		})
		res.send(addUC)

	}else{
		res.send('There is no channal availble');
	}
})

app.get('/showUsers', async(req,res) => {
	let arr = [];
	let checkUser = await User.findOne({where:{id: req.query.user_id}})
	if (checkUser) {
		let getUserChannal = await ChannalUser.findAll({where:{
				user_id: checkUser.id
			}}
		);
		let loopChannal = await getUserChannal.map(async(li) => {
			let getChannalDet = await Channal.findOne({where:{id: li.channal_id}})
			let hashCha = {};
			hashCha['name'] = getChannalDet.name
			hashCha["channal_desc"] = getChannalDet.channal_desc
			hashCha['user_id'] = li.user_id
			console.log('arr')
			console.log(arr)
			arr.push(hashCha)

		})
		await Promise.all(loopChannal);
		// console.log(getUserChannal)
		res.send(arr)
	}
	else{
		res.send('No user available')
	}
})



module.exports = app;