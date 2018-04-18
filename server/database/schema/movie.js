const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId, Mixed } = Schema.Types;   // 可以存储任何的数据类型；比较适合数据变化频繁的场景

const movieSchema = new Schema({
    doubanId: {
        unique: true,
        type: String
    },
    // 两张 Schema 的关联关系
    category: {
        type: ObjectId,
        ref: 'Category'    // 指想模型
    },
    rate: Number,               // 评分
    title: String,               // 标题
    summary: String,               // 简介
    video: String,               // 预告视频地址
    poster: String,               // 海报图
    cover: String,               // 封面图

    videoKey: String,               // 七牛图床锁定资源唯一一key
    posterKey: String,
    coverKey: String,

    rawTitle: String,               // 原始标题（英文）
    movieTypes: [String],               // 类别
    pubdate: Mixed,               // 上线日期
    year: Number,               // 上线年份

    tags: [String],               // 标签；惊悚、恐怖...

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
movieSchema.pre('save', next => {
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
mongoose.model('Movie', movieSchema);