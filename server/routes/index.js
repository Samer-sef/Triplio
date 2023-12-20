const express = require("express");
const router = express.Router();


router.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next();
});

router.use("/api", require("./api/auth"));
router.use("/api", require("./api/users"));


module.exports = router;