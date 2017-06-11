var test = require('tape');
var context = require('audio-context')();
var Writer = require('./');
var AudioBuffer = require('audio-buffer');
var util = require('audio-buffer-utils');
var Generate = require('audio-generator/direct.js')



test('Writer', function (t) {
	let frame = 1024;
	let write = Writer(context.destination, {
		samplesPerFrame: 1024
	});
	let generate = Generate(t => Math.sin(440 * t * Math.PI * 2));

	let isStopped = 0;
	setTimeout(() => {
		isStopped = 1;
	}, 500);
	function gen (err) {
		if (err) throw err;
		if (isStopped) {
			write(null);
			t.end()
			return;
		}
		let buf = generate(util.create(frame));
		write(buf, gen);
	}
	gen();
});


test('Write AudioBuffer', function (t) {
	var write = Writer(context.destination);

	var buf = new AudioBuffer(context, {length: 1024*8});
	util.noise(buf);
	write(buf);

	setTimeout(function () {
		write.end();
		t.end();
	}, 300);
});

test('Write Float32Array', function (t) {
	var write = Writer(context.destination, {channels: 1});

	var buf = new AudioBuffer(context, {length: 1024*8});
	util.noise(buf);

	write(buf.getChannelData(0));

	setTimeout(function () {
		write.end();
		t.end();
	}, 300);
});

test('Write Array', function (t) {
	var write = Writer(context.destination, {channels: 1});

	var a = Array(1024*8).fill(0).map(function () {return Math.random()});

	write(a);

	setTimeout(function () {
		t.end();
	}, 300);
});

test('Write ArrayBuffer', function (t) {
	var write = Writer(context.destination, {channels: 1});

	var buf = new AudioBuffer(context, {length: 1024*8});
	util.noise(buf);

	write(buf.getChannelData(0).buffer);

	setTimeout(function () {
		t.end();
	}, 300);
});


test('Write Buffer', function (t) {
	var write = Writer(context.destination, {channels: 1});

	var buf = new AudioBuffer(context, {length: 1024*8});
	util.noise(buf);

	buf = new Buffer(buf.getChannelData(0).buffer);

	write(buf);

	setTimeout(function () {
		t.end();
	}, 300);
});


test('Chain of sound processing', function (t) {
	var panner = context.createStereoPanner();
	panner.pan.value = -1;
	panner.connect(context.destination);

	var write = Writer(panner);

	var generate = Generate(function (time) {
		return Math.sin(Math.PI * 2 * 220 * time);
	})


	write(generate(util.create(1024*3, 2)))

	setTimeout(function () {
		write(null);
		t.end();
	}, 500);
});

test('Delayed connection/start');
