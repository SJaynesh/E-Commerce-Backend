const express = require('express');
const { registerAdmin, loginAdmin, fetchAllAdmin, forgotPassword, verifyOTP, newPassword, } = require('../../../controllers/auth/admin/admin.controller');
const { authMiddleware } = require('../../../middleware/auth.middleware');

const adminRoute = express.Router();

adminRoute.post('/register', registerAdmin);
adminRoute.post('/login', loginAdmin);
adminRoute.post('/forgot-password', forgotPassword);
adminRoute.post('/verify-otp', verifyOTP);
adminRoute.post('/new-password', newPassword);

// localhost:8000/api/auth/admin/register
// localhost:8000/api/auth/admin/login

adminRoute.get('/', authMiddleware, fetchAllAdmin);

module.exports = adminRoute;