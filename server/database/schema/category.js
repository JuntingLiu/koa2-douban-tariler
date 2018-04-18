const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;   // 可以存储任何的数据类型；比较适合数据变化频繁的场景

const categorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }],

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

// 保存之前处理
categorySchema.pre('save', function (next) {
    // 数据是否新数据
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } 
    else {
        this.meta.updatedAt = Date.now();
    }
    next();
});
// mongoose.model(model，schema)
// model  模型的名称
// schema   生成发布model的schema
mongoose.model('Category', categorySchema);