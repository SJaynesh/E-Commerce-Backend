const Admin = require("../../../model/admin.model");

module.exports = class AdminAuthService {
    async registerAdmin(body) {
        try {
            return await Admin.create(body);
        } catch (err) {
            console.log("Admin Register Error: ", err);
        }
    }

    async fetchSingleAdmin(body) {
        try {
            return await Admin.findOne(body);
        } catch (err) {
            console.log("Fetch Sigle Admin Error: ", err);
        }
    }

    async fetchAllAdmin() {
        try {
            return await Admin.find();
        } catch (err) {
            console.log("Fetch All Admin Error: ", err);
        }
    }

    async updateAdmin(id, body) {
        try {
            return await Admin.findByIdAndUpdate(id, body, { new: true });
        } catch (err) {
            console.log("Update Admin Error: ", err);
        }
    }
}

