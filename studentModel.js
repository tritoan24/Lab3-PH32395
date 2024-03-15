const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    msv: {
        type: String
    },
    status: {
        type: Boolean
    },
    image:{
        type: String
    }
});

const StudentModel = new mongoose.model('student', StudentSchema);

module.exports = StudentModel;