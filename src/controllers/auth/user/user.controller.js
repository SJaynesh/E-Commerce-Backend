const UserAuthService = require("../../../services/auth/user/user.service");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response");
const { sendOTPMail } = require("../../../utils/mailer");

const moment = require('moment');
const bcrypt = require('bcrypt');
const statusCode = require('http-status-codes');
const jwt = require('jsonwebtoken');

const userAuthService = new UserAuthService();

module.exports.registerUser = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email });

        if (user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_ALREADY_EXISTS));
        }

        req.body.password = await bcrypt.hash(req.body.password, 11);

        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss A');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss A');

        const newUser = await userAuthService.registerUser(req.body);

        if (!newUser) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_REGISTER_FAILED));
        }

        return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, MSG.USER_REGISTER_SUCCESS, newUser));

    } catch (err) {
        console.log("Error : ", err);
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email });

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_LOGIN_FAILED));
        }

        // JWT Token
        const payload = {
            userId: user.id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });


        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_LOGIN_SUCCESS, { token }));

    } catch (err) {
        console.log("Error : ", err);
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const user = await userAuthService.fetchSingleUser({ email: req.body.email });

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        if (user.attempt_expire < Date.now()) { // 11:17 < 09:00
            user.attempt = 0;
        }

        if (user.attempt >= 3) { // 3 >= 3
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.MANY_TIME_OTP));
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);

        await sendOTPMail(req.body.email, OTP);

        user.attempt++; // attempt = 3

        const expireOTPTime = new Date(Date.now() + 1000 * 60 * 2); //09:30 = 09:32

        await userAuthService.updateUser(user.id, { OTP: OTP, OTP_Expire: expireOTPTime, attempt: user.attempt, attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.OTP_SEND));

    } catch (err) {
        console.log("Error : ", err);
    }
}

module.exports.verifyOTP = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email });

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        if (user.verify_attempt_expire < Date.now()) { // 11:17 < 09:00
            user.verify_attempt = 0;
        }

        if (user.verify_attempt >= 3) { // 3 >= 3
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.MANY_TIME_OTP));
        }

        if (user.OTP_Expire < Date.now()) { // 09:50 < 09:48
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.OTP_EXPIRED));
        }

        user.verify_attempt++;

        await userAuthService.updateUser(user.id, { verify_attempt: user.verify_attempt, verify_attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });


        if (req.body.OTP !== user.OTP) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.INVALID_OTP));
        }

        await userAuthService.updateUser(user.id, { OTP: 0, OTP_Expire: null, verify_attempt: user.verify_attempt, verify_attempt_expire: new Date(Date.now() + 1000 * 60 * 60) });

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.VERIFY_OTP));




    } catch (err) {
        console.log("Error : ", err);
    }
}

module.exports.newPassword = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userAuthService.fetchSingleUser({ email: req.body.email });

        console.log(user);

        if (!user) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        req.body.new_password = await bcrypt.hash(req.body.new_password, 11);

        const updatedPassword = await userAuthService.updateUser(user.id, { password: req.body.new_password });

        if (!updatedPassword) {
            return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.USER_PASSWORD_UPDATE_FAILED));
        }

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.USER_PASSWORD_UPDATED));


    } catch (err) {
        console.log("Error : ", err);
    }
}

module.exports.fetchAllUser = async (req, res) => {
    try {
        const allAdmin = await adminAuthService.fetchAllAdmin();

        return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_FETCH_SUCCESS, allAdmin));
    } catch (err) {
        console.log("Error : ", err);
    }
}