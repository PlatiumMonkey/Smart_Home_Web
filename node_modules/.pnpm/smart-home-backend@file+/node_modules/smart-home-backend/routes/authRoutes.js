const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes liên quan đến đăng nhập
router.get('/login', authController.renderLoginPage); // Hiển thị form đăng nhập
router.post('/login', authController.handleLogin); // Xử lý đăng nhập

// Routes liên quan đến đăng ký
router.get('/register', authController.renderRegisterPage); // Hiển thị form đăng ký
router.post('/register', authController.handleRegister); // Xử lý đăng ký

// Routes liên quan đến quên mật khẩu
router.get('/forgotPassword', authController.renderForgotPasswordPage); // Hiển thị form quên mật khẩu
router.post('/forgotPassword', authController.handleForgotPassword); // Xử lý quên mật khẩu

// Routes liên quan đến đặt lại mật khẩu
router.get('/resetPassword', authController.renderResetPasswordPage); // Hiển thị form đặt lại mật khẩu
router.post('/resetPassword', authController.handleResetPassword); // Xử lý đặt lại mật khẩu

module.exports = router;
