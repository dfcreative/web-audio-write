# web-audio-write [![Greenkeeper badge](https://badges.greenkeeper.io/audiojs/web-audio-write.svg)](https://greenkeeper.io/) [![stable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Send AudioBuffer/Buffer/ArrayBuffer/FloatArray data to web audio.

## Usage

[![npm install web-audio-write](https://nodei.co/npm/web-audio-write.png?mini=true)](https://npmjs.org/package/web-audio-write/)

```js
const createWriter = require('web-audio-write')
const createGenerator = require('audio-generator')

let write = createWriter(context.destination)
let generate = createGenerator(t => Math.sin(440 * t * Math.PI * 2))
let stop = false

function tick (err) {
	if (err) throw err
	if (stop) {
		write(null)
		return
	}

	//send audio buffer to audio node
	write(generate(), tick)
}
tick()

setTimeout(() => {
	stop = true
}, 500)
```

## API

### `let write = createWriter(destNode?, options?)`

Create function writing to web-audio _AudioNode_. The created writer has the following signature: `buf = write(buf, onconsumed?)`. To schedule ending, call `write(null)`. To halt instantly, call `write.end()`.

`options` may provide:

* `mode` − `'script'` or `'buffer'`, defines mode of feeding data, may affect performance insignificantly.
* `context` − audio context, by default `destNode.context` is used.
* `samplesPerFrame` defines processing block size, defaults to 1024
* `channels` defines expected buffer number of channels, defaults to `destNode.channelCount`.

If `destNode` is not provided, a default `audioContext.destination` is used.

Writer recognizes any type of data sent into it: [AudioBuffer](https://github.com/audiojs/audio-buffer), [AudioBufferList](https://github.com/audiojs/audio-buffer-list), ArrayBuffer, FloatArray, Buffer, Array. `samplesPerFrame` and `channels` are used to convert raw data to AudioBuffer.

Internally writer uses [audio-buffer-list](https://github.com/audiojs/audio-buffer-list) to manage memory efficiently, providing lowest possible latency.


## Related

* [web-audio-read](https://github.com/audiojs/web-audio-read) — read data from web audio.
* [web-audio-stream](https://github.com/audiojs/web-audio-stream) — stream interface for web-audio.
* [pull-web-audio](https://github.com/audiojs/pull-web-audio) — pull-stream interface for web-audio.

## License

(c) 2017 Dmitry Yvanov. MIT License
