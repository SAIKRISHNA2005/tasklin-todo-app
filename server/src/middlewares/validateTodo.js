const validateTodo = (req, res, next) => {
  const { method, body } = req;

  // For POST and PUT, title is required
  if ((method === 'POST' || method === 'PUT') && !body.title) {
    return res.status(400).json({
      success: false,
      error: 'Title is required',
    });
  }

  // Validate title if provided
  if (body.title && typeof body.title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Title must be a string',
    });
  }

  // Validate description if provided
  if (body.description && typeof body.description !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Description must be a string',
    });
  }

  // Validate status if provided
  if (body.status && !['pending', 'completed'].includes(body.status)) {
    return res.status(400).json({
      success: false,
      error: 'Status must be either "pending" or "completed"',
    });
  }

  // Validate priority if provided
  if (body.priority && !['low', 'medium', 'high'].includes(body.priority)) {
    return res.status(400).json({
      success: false,
      error: 'Priority must be one of: low, medium, high',
    });
  }

  // Validate dueDate if provided
  if (body.dueDate && isNaN(Date.parse(body.dueDate))) {
    return res.status(400).json({
      success: false,
      error: 'Due date must be a valid date',
    });
  }

  // Validate tags if provided
  if (body.tags) {
    if (!Array.isArray(body.tags)) {
      return res.status(400).json({
        success: false,
        error: 'Tags must be an array of strings',
      });
    }
    if (!body.tags.every((tag) => typeof tag === 'string')) {
      return res.status(400).json({
        success: false,
        error: 'All tags must be strings',
      });
    }
  }

  next();
};

module.exports = validateTodo;
