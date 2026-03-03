const express = require('express');
const { registerAdmin, loginAdmin, fetchAllAdmin, forgotPassword, verifyOTP, newPassword, deleteAdmin, updateAdmin, activeOrInActiveAdmin, adminProfile, } = require('../../../controllers/auth/admin/admin.controller');
const { authMiddleware } = require('../../../middleware/auth.middleware');

const adminRoute = express.Router();

adminRoute.post('/register', registerAdmin);
adminRoute.post('/login', loginAdmin);
adminRoute.post('/forgot-password', forgotPassword);
adminRoute.post('/verify-otp', verifyOTP);
adminRoute.post('/new-password', newPassword);

// localhost:8000/api/auth/admin/register
// localhost:8000/api/auth/admin/login

// Rest API

adminRoute.use(authMiddleware);

adminRoute.get('/', fetchAllAdmin);
adminRoute.delete('/', deleteAdmin);
adminRoute.patch('/:id', updateAdmin);
adminRoute.put('/', activeOrInActiveAdmin);
adminRoute.get('/profile', adminProfile);

module.exports = adminRoute;