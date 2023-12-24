const router = require("express").Router();
const RegisterController = require('../../controllers/RegisterController');
const RefreshTokenController = require('../../controllers/RefreshTokenController');
const LogoutController = require('../../controllers/LogoutController');
const AuthController = require('../../controllers/AuthController');


router.get("/refresh", RefreshTokenController.handleRefreshToken);
router.post("/register", RegisterController.handleNewUser);
router.post("/login", AuthController.handleLogin);
router.get("/logout", LogoutController.handleLogout);


module.exports = router;