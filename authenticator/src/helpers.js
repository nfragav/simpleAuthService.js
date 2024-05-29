const handleResponse = (ctx) => (statusCode, body) => {
  ctx.body = body;
  ctx.status = statusCode;
};

module.exports = {
  handleResponse,
};
