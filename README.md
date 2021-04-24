configurable thumbnail generator

uses [sharp](https://github.com/lovell/sharp)

## setup

- download [tsk-thumbnails.tar.xz](https://github.com/r1vn/tsk-thumbnails/raw/master/tsk-thumbnails.tar.xz) and unpack as `your-project/lib/tsk-thumbnails`
- `cd your-project/lib/tsk-thumbnails` and run `npm ci`
- add a config entry to the manifest

example config: generating 320*any thumbnails for all .jpg files in `build`

```
build/bar/file1.jpg
build/baz/file2.jpg
build/file3.jpg
```

```
{
    module: 'lib/tsk-thumbnails',
    config:
    {
        // path of the directory to look for images in
        sourceDir: 'build',
        // filter for the files in sourceDir
        filter: srcPath => srcPath.endsWith('.jpg') && !srcPath.endsWith('-thumb.jpg'),
        // generates output paths based on source paths
        dstFn: srcPath => srcPath.replace('.jpg', '-thumb.jpg'),
        // options passed to sharp
        // https://sharp.pixelplumbing.com/api-constructor#parameters
        opts:
        {
            width: 320
        },
        // toggles overwriting existing files
        overwrite: false,
        // toggles verbose output
        verbose: true
    }
}
```

result:

```
build/bar/file1.jpg
build/bar/file1-thumb.jpg
build/baz/file2.jpg
build/baz/file2-thumb.jpg
build/file3.jpg
build/file3-thumb.jpg
```