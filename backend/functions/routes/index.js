const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const formRouter = require('./form');
const adminRouter = require('./admin-api-without-auth');

/**
 * 根路由聚合
 * 这里挂载 /user 相关的子路由
 */
router.use('/user', userRouter);
router.use('/form', formRouter);
router.use('/admin', adminRouter);

module.exports = router;


