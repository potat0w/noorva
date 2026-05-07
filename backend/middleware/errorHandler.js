const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Supabase error handling
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.message = 'Duplicate entry found';
        break;
      case '23503': // Foreign key violation
        error.message = 'Referenced record not found';
        break;
      case '23502': // Not null violation
        error.message = 'Required field is missing';
        break;
      case '42P01': // Undefined table
        error.message = 'Table not found';
        break;
      case '42703': // Undefined column
        error.message = 'Column not found';
        break;
      default:
        error.message = 'Database error occurred';
    }
  }

  // JWT error handling
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json({ error: error.message });
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json({ error: error.message });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error.message = message;
    return res.status(400).json({ error: error.message });
  }

  // Syntax error (invalid JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error.message = 'Invalid JSON format';
    return res.status(400).json({ error: error.message });
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
