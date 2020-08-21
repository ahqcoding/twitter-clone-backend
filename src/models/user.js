const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema({
    nickname:
    {
        type: String,
    },
    email:
    {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    username:
    {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password:
    {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    }
})



userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

        if (err) {
            if (err.name === "MongoError" && err.code === 11000) return next(err);
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })

})

userSchema.methods.comparePassword = async function (candidatePassword) {
    const match = await bcrypt.compare(candidatePassword, this.password);
    return match;
}

module.exports = mongoose.model('User', userSchema);