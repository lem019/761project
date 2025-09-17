const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const formRouter = require('./form');

/**
 * 根路由聚合
 * 这里挂载 /user 相关的子路由
 */
router.use('/user', userRouter);
router.use('/form', formRouter);

module.exports = router;


