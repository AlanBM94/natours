const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) --------------------------Middlewares-----------------------------------

app.use(cors());

app.options('*', cors());

// Show static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(helmet());

// Development loggin
if (process.env.NODE_ENV === 'development') {
  // Displays information about the request
  app.use(morgan('dev'));
}

// Limit requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour'
});

app.use('/api', limiter);

// Body parser
// This middleware converts the JSON object to a JavaScript object
app.use(express.json({ limit: '10kb' }));
// Parses the data from a form sended via urlencoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());
// Parses the cookie

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());

// Show the date when the request was made
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies, 'Esta es la cookie de los headers');
  next();
});

// 3) --------------------------------------Routes-------------------------------------------

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle the routes that were not found
app.all('*', (req, res, next) => {
  // console.log(req.originalUrl);
  // When an argument is passed into the next function express will assume that is an error and will skip all the middlewares until it reaches the error handler middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
// 4) -------------------------------Start the server---------------------------------------
module.exports = app;
