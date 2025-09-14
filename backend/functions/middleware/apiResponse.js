
const apiResponse = {
  success: ({ res, data = null, message = "Success", code = 200 }) => {
    return res.status(code).json({ code, message, data });
  },
  error: ({ res, message = "Error", code = 500, errors = null }) => {
    return res.status(code).json({ code, message, errors });
  },
  unauthorized: ({ res, message = "Unauthorized", code = 401 }) => {
    return res.status(code).json({ code, message });
  },
  forbidden: ({ res, message = "Forbidden", code = 403 }) => {
    return res.status(code).json({ code, message });
  }
};

module.exports = apiResponse;