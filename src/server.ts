import jsonServer from 'json-server'
import registerController from './controllers/registerController'
import loginController from './controllers/loginController'
import { authMiddleware } from './middlewares/authMiddleware'

const databasePath = 'db.json'

const server = jsonServer.create()
const router = jsonServer.router(databasePath)

server.use(jsonServer.defaults({
	bodyParser: true
}))

server.post('/register', registerController)
server.post('/login', loginController)

server.use(authMiddleware)

server.use('/users', (req, res, next) => {
	if (req.method !== 'GET') {
		return res.status(404).json({
			message: 'not found route.'
		})
	}

	next()
})

server.use(router)

server.listen(3000, () => {
	console.log('Server running!')
})
