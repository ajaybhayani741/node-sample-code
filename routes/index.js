var express = require('express');
var router = express.Router();
const authRouter = require('./auth.routes') 
const userRouter = require('./user.routes')

router.use("/api/auth", authRouter);
router.use("/api/test", userRouter);

module.exports = router  

