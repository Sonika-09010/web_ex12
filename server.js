
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const cors = require('cors')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const client = new MongoClient('mongodb://127.0.0.1:27017')

let horoscopes

async function startServer() {
  try {
    await client.connect()

    const database = client.db('AstraTideDB')
    horoscopes = database.collection('Horoscopes')

    console.log('MongoDB Connected Successfully!')

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

// GET - View all horoscopes
app.get('/api/horoscopes', async (req, res) => {
  try {
    const records = await horoscopes.find().toArray()
    res.json(records)
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch horoscopes' })
  }
})

// POST - Add a horoscope
app.post('/api/horoscopes', async (req, res) => {
  try {
    const result = await horoscopes.insertOne(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Unable to add horoscope' })
  }
})

// PUT - Update a horoscope
app.put('/api/horoscopes/:id', async (req, res) => {
  try {
    const result = await horoscopes.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    )
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Unable to update horoscope' })
  }
})

// DELETE - Delete a horoscope
app.delete('/api/horoscopes/:id', async (req, res) => {
  try {
    const result = await horoscopes.deleteOne({
      _id: new ObjectId(req.params.id)
    })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete horoscope' })
  }
})

startServer()
