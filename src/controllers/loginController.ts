import { readData, writeData } from "../utils/databaseManager"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { createToken } from "../utils/jwtManager"

export default async function loginController(req: any, res: any) {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({
			message: 'email and password is required.'
		})
	}

	const users = await readData('users')

	const userExists = users.find((user: any) => user.email === email)

	if (!userExists) {
		return res.status(403).json({
			message: 'invalid email or password.'
		})
	}

	const isValidPassword = await bcrypt.compare(password, userExists.password)

	if (!isValidPassword) {
		return res.status(403).json({
			message: 'invalid email or password.'
		})
	}

	const token = createToken({ id: userExists.id })

	const loggedUser = {
		token,
		user: userExists
	}

	return res.status(200).json(loggedUser)
}