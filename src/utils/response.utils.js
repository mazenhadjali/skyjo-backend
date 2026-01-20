function sendSuccess(res, data = null, message = 'OK', status = 200) {
  return res.status(status).json({ data, success: true, failed: false, message });
}

function sendError(res, message = 'Error', status = 400, data = null) {
  return res.status(status).json({ data, success: false, failed: true, message });
}

module.exports = {
  sendSuccess,
  sendError,
};
