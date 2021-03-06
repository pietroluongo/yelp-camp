if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { scriptSrcUrls, connectSrcUrls, styleSrcUrls, fontSrcUrls } = require('./trustedSources');
const MongoDBStore = require('connect-mongo');

const ExpressError = require('./utils/ExpressError');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

const User = require('./models/User');

const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tacau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('db connected');
});

const app = express();

// App setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: [
            '\'self\'',
            ...connectSrcUrls
        ],
        scriptSrc: [
            '\'unsafe-inline\'',
            '\'self\'',
            ...scriptSrcUrls
        ],
        styleSrc: [
            '\'self\'',
            '\'unsafe-inline\'',
            ...styleSrcUrls
        ],
        workerSrc: [
            '\'self\'',
            'blob:'
        ],
        objectSrc: [],
        imgSrc: [
            '\'self\'',
            'blob:',
            'data:',
            'https://res.cloudinary.com/dq6kbbbza/',
            'https://images.unsplash.com/'
        ],
        fontSrc: [
            '\'self\'',
            ...fontSrcUrls
        ]
    }
}));

const store = new MongoDBStore({
    mongoUrl: mongoUrl,
    secret: process.env.MONGO_SECRET,
    touchAfter: 24 * 60 * 60
});

store.on('error', e => console.log('SESSION STORE ERROR', e));

// Session setup
const sessionConfig = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    name: 'yelpcampSession'
};
app.use(session(sessionConfig));


// Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Not Found', 404));
});

// Error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode);
    if (!err.message) {
        err.message = 'Something went wrong!';
    }
    res.render('error', { err });
    next();
});

app.listen(process.env.PORT || 3000, () => {
    console.log('All ok!');
});