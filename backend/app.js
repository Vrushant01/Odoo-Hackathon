const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const apiRouter = require('./src/routes');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const ApiError = require('./src/utils/apiError');

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS Policy (Restricted to CLIENT_URL)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 200, // limit each IP to 200 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 4. Request Logging (Morgan)
app.use(morgan('dev'));

// 5. Body Parsers (with size limits)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 6. Static Uploads Directory
const uploadDir = process.env.UPLOAD_PATH || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// 7. Versioned API Routes
app.use('/api/v1', apiRouter);

// Base landing route
app.get('/', (req, res) => {
  res.send('<h1>TransitOps Backend REST API</h1><p>Visit <code>/api/v1/health</code> to check system health.</p>');
});

// 8. 404 Handler for undefined routes
app.use((req, res, next) => {
  next(new ApiError(`Cannot find route ${req.originalUrl} on this server`, 404));
});

// 9. Central Global Error Handler
app.use(errorMiddleware);

module.exports = app;
