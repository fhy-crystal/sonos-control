var express = require('express'),
	sonos = require('sonos'),
	app = express(),
	bodyParser = require('body-parser');

var sonosInfo = {ip: '', port: ''}, devices = {}, Sonos = null;


app.use(bodyParser.json());
//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

sonos.search(function(data) {
	sonosInfo.ip = data.host;
	sonosInfo.port = data.port;
	// 实例化
	Sonos = new sonos.Sonos(sonosInfo.ip);

	// 列表
	app.get('/list', function(req, res) {
		Sonos.getQueue(function (err, playList) {
			console.log(err, playList);
			res.send(playList);
		})
	})

	// 播放
	app.get('/play', function(req, res) {
		Sonos.play(function (err, playing) {
			console.log(err, playing);
			res.send(playing);
		})
	})

	// 上一首
	app.get('/previous', function(req, res) {
		Sonos.previous(function (err, previoused) {
			if (!err || !previoused) {
				console.log('Complete');
				res.send(previoused);
			} else {
				console.log('OOOHHHHHH NOOOO');
			}
		})
	})

	// 下一首
	app.get('/next', function(req, res) {
		Sonos.next(function (err, nexted) {
			if (!err || !nexted) {
				console.log('Complete');
				res.send(nexted);
			} else {
				console.log('OOOHHHHHH NOOOO');
			}
		})
	})

	// 暂停
	app.get('/pause', function(req, res) {
		Sonos.pause(function (err, paused) {
			console.log(err, paused);
			res.send(paused);
		})
	})

	// 停止
	app.get('/stop', function(req, res) {
		Sonos.stop(function (err, stopped) {
			console.log(err, stopped);
			res.send(stopped);
		})
	})

	// 获取音量
	app.get('/getVolume', function(req, res) {
		Sonos.getVolume(function (err, volume) {
			console.log(err, volume);
			res.send({'volume': volume});
		})
	})

	// 设置音量
	app.post('/setVolume', function(req, res) {
		Sonos.setVolume(req.body.volume, function (err, volume) {
			console.log(err, volume);
			res.send({'volume': volume});
		})
	})




	data.deviceDescription(function(err, desc) {
		devices[desc.UDN] = data;
		devices[desc.UDN].description = desc;
		data.currentTrack(function(err, track) {
			devices[desc.UDN].track = track;
			// console.log(devices);
		});
	});
});


// var Sonos = new sonos.Sonos(sonosIp);
// console.log(sonosInfo.ip)


app.get('/deviceInfo', function(req, res) {
	res.send(devices);
})

// app.get('/play', function(req, res) {
// 	s.play(function (err, playing) {
// 		console.log(err, playing);
// 		res.send(playing);
// 	})
// })


var server = app.listen(8099, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("应用实例，访问地址为 http://%s:%s", host, port);

})