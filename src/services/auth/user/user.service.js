const User = require("../../../model/user.model");

module.exports = class UserAuthService {
    async registerUser(body) {
        try {
            return await User.create(body);
        } catch (err) {
            console.log("User Register Error: ", err);
        }
    }

    async fetchSingleUser(body) {
        try {
            return await User.findOne(body);
        } catch (err) {
            console.log("Fetch Sigle User Error: ", err);
        }
    }

    async fetchAllUser() {
        try {
            return await User.find();
        } catch (err) {
            console.log("Fetch All User Error: ", err);
        }
    }

    async updateUser(id, body) {
        try {
            return await User.findByIdAndUpdate(id, body, { new: true });
        } catch (err) {
            console.log("Update User Error: ", err);
        }
    }
}

