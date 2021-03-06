const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 7000;
// const port = 7000;

// middleware setUp 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        // console.log('database is connected');
        const database = client.db('travelExpress');
        const bookingPlacesCollection = database.collection('bookingPlaces');
        const bookingCollection = database.collection('bookings');

        // GET API
        app.get('/booking_places', async (req, res) => {
            const cursor = bookingPlacesCollection.find({});
            const bookingPlaces = await cursor.toArray();
            res.send(bookingPlaces);
        });

        // GET Single BOOKING API
        app.get('/booking_places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const bookingPlace = await bookingPlacesCollection.findOne(query);
            res.json(bookingPlace);
        });

        // POST API - Add Booking service
        app.post('/booking_places', async (req, res) => {
            const bookingPlace = req.body;
            const result = await bookingPlacesCollection.insertOne(bookingPlace);
            res.json(result);
        });

        // GET API - All User Bookings
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });

        // POST API - All User Bookings
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            res.json(result);
        });

        
        // MY Bookings
        app.get("/myBookings/:email", async (req, res) => {
            const result = await bookingCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // Cancel Bookings
        app.delete("/cancelBookings/:id", async (req, res) => {
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('TravelExpress server is running');
})

app.listen(port, () => {
    console.log('Running the server on', port, 'port');
})




