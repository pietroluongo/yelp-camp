const express = require('express');
const path = require('path');
const Campground = require('./models/Campground');

const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tacau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('db connected');
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/makeCampground', async (req, res) => {
    const camp = new Campground({
        title: 'Posto de Saúde',
        description: 'Postinho aqui do lado de casa'
    });
    await camp.save();
    res.send(camp);
});

app.listen(3000, () => {
    console.log('All ok!');
})