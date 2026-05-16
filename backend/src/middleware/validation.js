const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    next();
  };
};

module.exports = { validate };
