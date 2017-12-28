/**
 * koa-mongo middleware with mongoose and mongoose-redis-cache
 *
 * Example:
 *      const UserSchema = new mongoose.Schema({
 *          username: String,
 *          password: String
 *      })
 *      // set redis cache
 *      UserSchema.set('redisCache', true)
 *      UserSchema.set('expires', 30)   // default is 60 seconds
 *      const UserModel = mongoose.model('User', UserSchema, 'user')
 *
 * See: mongoose-redis-cache (https://github.com/conancat/mongoose-redis-cache)
 *
 * Author:
 *      Summer You <qyou AT nlpr.ia.ac.cn>
 *
 * License:
 *      MIT license
 */

const mongoose = require('mongoose')
const mongooseCache = require('mongoose-redis-cache')

function checkOpts(opts) {
    opts = opts || {}
    if (!opts.uri) {
        const host = opts.host || 'localhost'
        const port = opts.port || 27017
        const database = opts.database || ''
        if (opts.user && opts.password) {
            opts.uri = `mongodb://${opts.user}:${opts.password}@${host}:${port}/${database}`
        } else {
            opts.uri = `mongodb://${host}:${port}/${database}`
        }
    }
    opts.useMongoClient = true
    return opts
}

function checkRedisOpts(redisOpts = {}) {
    redisOpts.host = redisOpts.host || 'localhost'
    redisOpts.port = redisOpts.port || 6379
    return redisOpts
}

function omit(opts, key) {
    if (key in opts) {
        return Object.assign({}, opts)
    }
    const optsWithoutKey = Object.define(null)
    for (let k in opts) {
        if (k !== key) {
            optsWithoutKey[k] = opts[k]
        }
    }
    return optsWithoutKey
}

const middleware = exports = module.exports = (opts, redisOpts) => {
    mongoose.Promise = Promise
    // first set redis cache
    redisOpts = checkRedisOpts(redisOpts)
    mongooseCache(mongoose, redisOpts) // use redis cache

    opts = checkOpts(opts)

    const db = middleware.open(opts)
    return async(ctx, next) => {
        await next()
    }
}

middleware.open = function (opts) {
    const optsWithoutUri = omit(opts, 'uri')

    mongoose.connect(opts.uri, optsWithoutUri)
    const db = mongoose.connection

    db.on('error', (err) => {
        console.error(`ERROR happens in mongodb ${opts.uri}`)
        db.close(() => {
            console.log(`mongodb is closed!, uri=${opts.uri}`)
        })
    })

    db.once('open', () => {
        console.log(`mongodb ${opts.uri} opened`)
    })
    return db
}
