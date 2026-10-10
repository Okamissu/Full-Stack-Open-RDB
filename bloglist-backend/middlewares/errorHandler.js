const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.message,
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Username already exists',
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
};

module.exports = errorHandler;
