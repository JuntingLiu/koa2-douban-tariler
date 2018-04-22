const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;   // 可以存储任何的数据类型；比较适合数据变化频繁的场景
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;            // 加严长度
const MAX_LOGIN_ATTEMPTS = 5;           // 出错次数
const LOCK_TIME = 2 * 60 * 60 * 1000;   // 账号锁定时间

const userSchema = new Schema({
    username: {
        unique: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    lockUntil: Number,      // 锁定时间 毫秒
    loginAttempts: {        // 登录次数
        type: Number,
        required: true,
        default: 0
    },

    meta: {               // 描述
        createdAt: {               // 创建时间
            type: Date,
            default: Date.now()
        },
        updatedAt: {               // 更新时间
            type: Date,
            default: Date.now()
        }
    }
});

// 账号锁定时间
userSchema.virtual('isLocked').get(function () {
    // 取反两次，拿到 true or false
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// 保存之前处理
userSchema.pre('save', function (next)  {
    // 数据是否新数据
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } 
    else {
        this.meta.updatedAt = Date.now();
    }
    next();
});

// 保存之前处理
userSchema.pre('save', function (next) {
    // 密码是否有修改
    if (!this.isModified('password')) return next();
    // 密码进行加严
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        // 加密
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);

            this.password = hash;
            next();
        });
    });
    next();
});

// 给 model 添加实例方法
userSchema.methods = {
    // 密码比较 _password 明文提交的密码， password 加严加密的密码
    comparePassword: function (_password, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                // 比较过程是否出错，没出错把比较的值返回
                if (!err) resolve(isMatch);
                else reject(err);
            })
        });
    },
    // 登录次数限制
    incLoginAttempts: user => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, 
                err => {
                    if (!err) resolve(true);
                    else reject(err);
                });
            } 
            else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                };

                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                this.update(updates, err => {
                    if (!err) resolve(true);
                    else reject(err);
                })
            }
        });
    }
};

// mongoose.model(model，schema)
// model  模型的名称
// schema   生成发布model的schema
mongoose.model('User', userSchema);