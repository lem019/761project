const express = require('express');
const router = express.Router();

const userRouter = require('./user');

/**
 * 根路由聚合
 * 这里挂载 /user 相关的子路由
 */
router.use('/user', userRouter);

module.exports = router;


