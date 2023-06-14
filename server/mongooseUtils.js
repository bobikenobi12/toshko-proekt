const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const uri = "mongodb+srv://todorbg710:MNuZq29fiBTV5mvk@vsl.bgp3mgn.mongodb.net/?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
    id: String,
    password: String,
    username: String,
});


const UserModel = mongoose.model('User', userSchema);

const readUser = async (username) => {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Find the user based on the provided name
        const user = await UserModel.findOne({ username });

        if (user) {
            // User found
            return user;
        } else {
            // User not found
            return null;
        }
    } catch (error) {
        console.error('Error reading user:', error);
        return null;
    } finally {
        // Disconnect from the MongoDB database
        mongoose.disconnect();
    }
};

const createUser = async (username, password) => {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            username,
            password: encryptedPassword
        });

        await user.save();
        console.log('User saved successfully');
        return user;
    } catch (error) {
        console.error('Error saving user:', error);
        return null;
    } finally {
        // Disconnect from the MongoDB database
        mongoose.disconnect();
    }
};

module.exports = { readUser, createUser };
