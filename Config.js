'use strict'

module.exports = class Config
{
    sourceDir
    filter
    dstFn
    opts
    overwrite
    verbose

    constructor (opts)
    {
        for (const key in this)
        {
            if (!opts.hasOwnProperty(key))
            {
                throw `missing property: '${ key }'`
            }
        }

        for (const key in opts)
        {
            if (!this.hasOwnProperty(key))
            {
                throw `unknown property: '${ key }'`
            }

            this[key] = opts[key]
        }

        // sourceDir

        if (typeof this.sourceDir !== 'string')
        {
            throw `config.sourceDir: must be a string`
        }

        // filter / dstFn

        for (const prop of ['filter', 'dstFn'])
        {
            if (typeof this[prop] !== 'function')
            {
                throw `config.${ prop } must be a function`
            }
        }

        // opts

        if (!this.opts || this.opts.constructor !== Object)
        {
            throw `config.opts must be an object`
        }
    }
}