import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const UserData = mongoose.model('UserData', userDataSchema);
export default UserData