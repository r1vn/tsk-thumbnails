'use strict'

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { xdDirScan } = require('./util/xdDirScan')
const { xdFileWrite } = require('./util/xdFileWrite')
const { xdPath } = require('./util/xdPath')
const Config = require('./Config')

module.exports = async function tsk_thumbnails (opts)
{
    const t = err => { console.log(err); process.exit(1) }
    process.on('uncaughtException', err => t(err))
    process.on('unhandledRejection', err => t(err))

    const debug = process.argv.includes('-debug')
    const config = new Config(opts)
    if (debug) console.log({ config })
    const srcdirRel = xdPath.std(config.sourceDir)
    const srcdirAbs = xdPath.abs(config.sourceDir)
    if (debug) console.log({ srcdirRel, srcdirAbs })
    const srcs = xdDirScan(srcdirAbs, 'files').filter(config.filter)
    const dsts = []
    let procN = 0
    let skipN = 0

    for (let i = 0; i < srcs.length; i++)
    {
        if (config.verbose) console.log(`${ i + 1 }/${ srcs.length }`)
        const srcRel = `${ srcdirRel }/${ srcs[i] }`
        const srcAbs = `${ srcdirAbs }/${ srcs[i] }`
        const dstRel = xdPath.std(config.dstFn(srcRel))
        const dstAbs = xdPath.abs(dstRel)
        if (config.verbose) console.log(`src: ${ srcRel }\ndst: ${ dstRel }`)
        if (debug) console.log({ srcRel, srcAbs, dstRel, dstAbs })
        if (dsts.includes(dstAbs)) throw `duplicate destination path`
        dsts.push(dstAbs)

        if (config.overwrite || !fs.existsSync(dstAbs))
        {
            const input = fs.readFileSync(srcAbs)

            const output = await sharp(input)
            .resize(config.opts)
            .toBuffer()

            xdFileWrite(dstAbs, output)
            procN++
        }
        else
        {
            if (config.verbose) console.log('* skipped *')
            skipN++
        }
    }

    console.log(`\nprocessed: ${ procN }\nskipped:   ${ skipN }`)
}