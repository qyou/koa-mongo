# koa-mongo
koa middleware for mongoose and mongoose-redis-cache

# Add to your koa project

```js
    const app = require('koa')()
    const mongo = require('koa-mongo')

    ...
    app.use(mongo({
        // mongo settings
        uri: 'mongodb://username:password@localhost:27017/test'
    }, 
    {
        // redis settings
        host: 'localhost',
        port: 6379
    }))

```

# Use redis as mongoose cache

Schema settings:
```js

    const ExampleSchema = new mongoose.Schema({...})
    // use redis cache
    ExampleSchema.set('redisCache', true)
    // set expires (default is 60 seconds)
    ExampleSchema.set('expires', 30)
```

Use `Query.lean()` to cache the result.
```js

    // use `lean()` to cache the result
    ExampleModel.distinct('username').lean().exec()
```
See [`mongoose-redis-cache`](https://github.com/conancat/mongoose-redis-cache) for more details about the redis cache usage.

# License

    MIT license


