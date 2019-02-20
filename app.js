const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const uuid = require('uuid')
const { check, validationResult } = require('express-validator/check')

// mongojs
const mongojs = require('mongojs')
const uri = 'mongodb://yokiijay:0096412qian@cluster0-shard-00-00-mwnzv.mongodb.net:27017,cluster0-shard-00-01-mwnzv.mongodb.net:27017,cluster0-shard-00-02-mwnzv.mongodb.net:27017/customersapp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
const db = mongojs(uri,['users'])
const ObjectId = mongojs.ObjectId

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res,next)=>{
	res.locals.errors = null
	next()
})

// my fake data
const users = [
	{
		id: uuid.v4(),
		first_name: 'Yokiijay',
		last_name: 'Yu',
		email: 'dja@qq.com'
	},
	{
		id: uuid.v4(),
		first_name: 'Bill',
		last_name: 'Kin',
		email: 'dsada@qq.com'
	},
	{
		id: uuid.v4(),
		first_name: 'William',
		last_name: 'Dasmend',
		email: 'FasdsDesmend@qq.com'
	}
]

app.get('/', (req,res)=>{
	db.users.find((err,docs)=>{
		if (err) throw err
		res.render('index', {
			title: 'Customers',
			users: docs
		})
	})
})

app.post('/users/add', [
	check('username').not().isEmpty().withMessage('First Name Required!'),
	check('age').not().isEmpty().withMessage('Last Name Required!'),
	check('email').not().isEmpty().withMessage('Email Required!')
], (req,res)=>{
	// 检测错误
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		// return res.status(422).json({ errors: errors.array() })
		db.users.find((err,docs)=>{
			if (err) throw err
			res.render('index', {
				title: 'Customers',
				users: docs,
				errors: errors.array()
			})
		})
		console.log('invalid ')
		return
	}
	// 没错误
	const { username, age, email } = req.body
	const newUsers = { username, age, email }
	db.users.insert(newUsers, err=>{
		if (err) throw err
		res.redirect('/')
	})
})

app.delete('/users/delete',(req,res)=>{
	const id = req.query.id
	db.users.remove({_id: ObjectId(id)}, err=>{
		if (err) throw err
		res.end()
	})
})

app.listen(3000,()=>console.log('Server running at port 3000'))