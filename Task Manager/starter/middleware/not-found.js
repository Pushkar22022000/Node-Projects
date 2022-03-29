// middleware for error 404
const notFound = (req, res) => res.status(404).send("Route does not exist");

module.exports = notFound;
