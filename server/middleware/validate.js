import { body, query, validationResult } from 'express-validator';

// Reusable handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Auth schemas
export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Weather schema
export const validateWeatherQuery = [
  query('city')
    .optional()
    .isLength({ max: 100 })
    .matches(/^[a-zA-Z\s\-,]+$/)
    .withMessage('Invalid city name'),
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lon').optional().isFloat({ min: -180, max: 180 }),
  handleValidationErrors,
];

// Favorites schema
export const validateFavorite = [
  body('city')
    .notEmpty().withMessage('City is required')
    .isLength({ max: 100 })
    .matches(/^[a-zA-Z\s\-,]+$/)
    .withMessage('Invalid city name'),
  handleValidationErrors,
];
