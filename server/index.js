const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

//json
app.use(express.json())

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

//Test api
app.get('/test', (req, res) => {
    try {
        res.status(200).json({ message: 'API is working' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique(
            {
                where: {
                    id: Number(req.params.id)
                }
            }
        );
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Create user
app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create(
            {
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
            }
        );
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.update(
            {
                where: { id: Number(req.params.id) },
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
            }
        );
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.delete(
            {
                where: { id: Number(req.params.id) }
            }
        );
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const PORT = process.env.PORT || 4000; //Use the port from the env file, if anything goes wrong then use port 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))