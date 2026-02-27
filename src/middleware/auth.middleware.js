const jwt = require('jsonwebtoken');
const status = require('http-status-codes');
const { errorResponse } = require('../utils/response');
const { MSG } = require('../utils/msg');
const AdminAuthService = require('../services/auth/admin/admin.service');

const adminAuthService = new AdminAuthService();

module.exports.authMiddleware = async (req, res, next) => {

    let token = req.headers.authorization;

    if (!token) {
        return res.status(status.BAD_REQUEST).json(errorResponse(status.BAD_REQUEST, true, MSG.TOKEN_MISSING));
    }

    token = token.slice(7, token.length);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log(decoded.adminId);

        const admin = await adminAuthService.fetchSingleAdmin({ _id: decoded.adminId });

        if (admin) {
            next();
        } else {
            return res.status(status.BAD_REQUEST).json(errorResponse(status.BAD_REQUEST, true, MSG.TOKEN_INVALID));
        }
    } catch (err) {
        console.log(err);
        return res.status(status.BAD_REQUEST).json(errorResponse(status.BAD_REQUEST, true, MSG.TOKEN_INVALID));
    }

}