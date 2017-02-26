/**
 * Created by camer on 2/25/2017.
 */

"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
    user: {
        Schema: UserSchema,
        Model: UserModel
    }
};