const mongoose = require('mongoose');

// Create thhe user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

//create, instantiate and export the schema
const Users = mongoose.model('User', UserSchema);
module.exports = Users;