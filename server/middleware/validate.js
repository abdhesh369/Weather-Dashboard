import { body, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

// ── Auth schemas ──────────────────────────────────────────────────────────────
export const validateRegister = [
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('A valid email address is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ── Weather schema ────────────────────────────────────────────────────────────
// Relaxed city regex: allows accented chars, apostrophes, dots (e.g. "São Paulo", "St. John's")
export const validateWeatherQuery = [
  query('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name must be between 1 and 100 characters'),
  query('lat').optional().isFloat({ min: -90,  max: 90  }).withMessage('Invalid latitude'),
  query('lon').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  handleValidationErrors,
];

// ── Favorites schema ──────────────────────────────────────────────────────────
export const validateFavorite = [
  body('city')
    .notEmpty().withMessage('City is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name must be between 1 and 100 characters'),
  handleValidationErrors,
];
