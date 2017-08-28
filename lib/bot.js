'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var recastai = require('recastai').default;
var client = new recastai(process.env.REQUEST_TOKEN);
var request = require('request');

var replyMessage = function replyMessage(message, text, res) {
	var recastaiReq = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE);
	var content = message ? message.content : text;
	var type = message.type;

	recastaiReq.analyseText(content).then(function (recastaiRes) {
		var intent = recastaiRes.intent();
		console.log(intent);

		if (intent && intent.slug === 'greetings') {

			var reply = {
				type: 'quickReplies',
				content: {
					title: 'Hai, apa yang kamu butuhkan? :)',
					buttons: [{
						title: 'Daftar Informasi',
						value: 'menu awal'
					}]
				}
			};

			return message ? message.reply([reply]) : res.json({ reply: 'Hi, apa yang kamu butuhkan? :)' });
		}

		if (intent && intent.slug === 'disagree') {
			var _reply = {
				type: 'text',
				content: 'oke, terimakasih :)'
			};

			return message ? message.reply([_reply]) : res.send({ reply: 'Hi :)' });
		}

		if (intent && intent.slug === 'agree') {

			var _reply2 = {
				type: 'quickReplies',
				content: {
					title: 'Silahkan lihat daftar informasi untuk melihat informasi lainnya :)',
					buttons: [{
						title: 'Daftar Informasi',
						value: 'menu awal'
					}]
				}
			};

			return message ? message.reply([_reply2]) : res.send({ reply: 'Hi :)' });
		}

		if (intent && intent.slug === 'thanking') {
			var _reply3 = {
				type: 'text',
				content: 'sama-sama :)'
			};

			return message ? message.reply([_reply3]) : res.send({ reply: 'Hi :)' });
		}

		if (recastaiRes.entities.hasOwnProperty('menu')) {

			return message ? message.reply([{
				type: 'carousel',
				content: [{
					title: 'Informasi tentang jurusan',
					subtitle: 'Pilih informasi yang kamu butuhkan',
					imageUrl: 'http://politeknik.or.id/upload/39/galeri/gal_39-06-02-20171.jpg',
					buttons: [{
						title: 'Dosen',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'dosen'
					}, {
						title: 'Laboratorium',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'laboratorium'
					}, {
						title: 'Struktur Organisasi',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'struktur organisasi'
					}]
				}, {
					title: 'Informasi tentang akademik',
					subtitle: 'Pilih informasi yang kamu butuhkan',
					imageUrl: 'http://politeknik.or.id/upload/39/galeri/gal_39-06-02-20171.jpg',
					buttons: [{
						title: 'Kurikulum',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'kurikulum'
					}, {
						title: 'Jadwal Kuliah',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'jadwal'
					}, {
						title: 'Pendaftaran kuliah',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'pendaftaran'
					}]
				}]
			}]).then() : res.send({ reply: content });
		} else if (recastaiRes.entities.hasOwnProperty('jadwal')) {
			request('http://informtikabot.hol.es/api/v1/informasi/jadwal', function (_err, _res, body) {

				body = JSON.parse(body);

				return message ? message.reply([{
					type: 'text', content: 'oke, ini adalah jadwal kuliah jurusan TI POLINDRA'
				}, {
					type: 'card',
					content: {
						title: body.data[0].detail,
						buttons: [{
							title: 'Lihat Jadwal',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[0].link
						}]
					}
				}, {
					type: 'quickReplies',
					content: {
						title: 'apa ada lagi informasi yang dibutuhkan? :)',
						buttons: [{
							title: 'Daftar Informasi',
							value: 'menu awal'
						}]
					}
				}]).then() : res.send({ reply: content });
			});
		} else if (recastaiRes.entities.hasOwnProperty('kurikulum')) {
			request('http://informtikabot.hol.es/api/v1/informasi/kurikulum', function (_err, _res, body) {

				body = JSON.parse(body);

				return message ? message.reply([{
					type: 'text', content: 'oke, ini adalah kurikulum yang ada pada jurusan TI POLINDRA'
				}, {
					type: 'carousel',
					content: [{
						title: body.data[0].informasi,
						buttons: [{
							title: 'kurikulum',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[0].link
						}, {
							title: 'Detail tentang D3',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[0].detail
						}]
					}, {
						title: body.data[1].informasi,
						buttons: [{
							title: 'kurikulum',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[1].link
						}, {
							title: 'Detail tentang D4',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[1].detail
						}]
					}]
				}, {
					type: 'quickReplies',
					content: {
						title: 'apa ada lagi informasi yang dibutuhkan? :)',
						buttons: [{
							title: 'Daftar Informasi',
							value: 'menu awal'
						}]
					}
				}]).then() : res.send({ reply: content });
			});
		} else if (recastaiRes.entities.hasOwnProperty('organisasi')) {
			request('http://informtikabot.hol.es/api/v1/informasi/struktur', function (_err, _res, body) {

				body = JSON.parse(body);

				return message ? message.reply([{
					type: 'text', content: 'oke, ini adalah struktur organisasi pada jurusan TI POLINDRA'
				}, {
					type: 'picture', content: body.data[0].image
				}, {
					type: 'quickReplies',
					content: {
						title: 'apa ada lagi informasi yang dibutuhkan? :)',
						buttons: [{
							title: 'Daftar Informasi',
							value: 'menu awal'
						}]
					}
				}]).then() : res.send({ reply: content });
			});
		} else if (recastaiRes.entities.hasOwnProperty('daftar')) {
			request('http://informtikabot.hol.es/api/v1/informasi/pendaftaran', function (_err, _res, body) {

				body = JSON.parse(body);

				return message ? message.reply([{
					type: 'text', content: body.data[0].detail
				}, {
					type: 'card',
					content: {
						title: 'Untuk informasi selebihnya tentang pendaftarn bisa kunjungi website POLINDRA',
						buttons: [{
							title: 'website polindra',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: 'https://www.polindra.ac.id/'
						}]
					}
				}, {
					type: 'quickReplies',
					content: {
						title: 'apa ada lagi informasi yang dibutuhkan? :)',
						buttons: [{
							title: 'Daftar Informasi',
							value: 'menu awal'
						}]
					}
				}]).then() : res.send({ reply: content });
			});
		} else if (recastaiRes.entities.hasOwnProperty('laboratorium')) {
			request('http://informtikabot.hol.es/api/v1/informasi/lab', function (_err, _res, body) {

				body = JSON.parse(body);

				return message ? message.reply([{
					type: 'text',
					content: 'oke, ini informasi tentang lab yang di TI POLINDRA :)'
				}, {
					type: 'carousel',
					content: [{
						title: body.data[0].informasi,
						subtitle: body.data[0].detail,
						imageUrl: body.data[0].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[0].link
						}]
					}, {
						title: body.data[1].informasi,
						subtitle: body.data[1].detail,
						imageUrl: body.data[1].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[1].link
						}]
					}, {
						title: body.data[2].informasi,
						subtitle: body.data[2].detail,
						imageUrl: body.data[2].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[2].link
						}]
					}, {
						title: body.data[3].informasi,
						subtitle: body.data[3].detail,
						imageUrl: body.data[3].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[3].link
						}]
					}, {
						title: body.data[4].informasi,
						subtitle: body.data[4].detail,
						imageUrl: body.data[4].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[4].link
						}]
					}, {
						title: body.data[5].informasi,
						subtitle: body.data[5].detail,
						imageUrl: body.data[5].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[5].link
						}]
					}, {
						title: body.data[6].informasi,
						subtitle: body.data[6].detail,
						imageUrl: body.data[6].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[6].link
						}]
					}, {
						title: body.data[7].informasi,
						subtitle: body.data[7].detail,
						imageUrl: body.data[7].image,
						buttons: [{
							title: 'Lihat Detail',
							type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
							value: body.data[7].link
						}]
					}]
				}, {
					type: 'quickReplies',
					content: {
						title: 'apa ada lagi informasi yang dibutuhkan? :)',
						buttons: [{
							title: 'Daftar Informasi',
							value: 'menu awal'
						}]
					}
				}]).then() : res.send({ reply: content });
			});
		} else if (recastaiRes.entities.hasOwnProperty('dosen')) {
			request('http://informtikabot.hol.es/api/v1/informasi/dosen', function (_err, _res, body) {

				body = JSON.parse(body);

				return message ? message.reply([{
					type: 'text',
					content: 'oke, ini informasi tentang dosen pengajar yang ada di TI POLINDRA :)'
				}, {
					type: 'carousel',
					content: [{
						title: body.data[0].informasi,
						subtitle: body.data[0].detail,
						imageUrl: body.data[0].image
					}, {
						title: body.data[1].informasi,
						subtitle: body.data[1].detail,
						imageUrl: body.data[1].image
					}, {
						title: body.data[2].informasi,
						subtitle: body.data[2].detail,
						imageUrl: body.data[2].image
					}, {
						title: body.data[3].informasi,
						subtitle: body.data[3].detail,
						imageUrl: body.data[3].image
					}, {
						title: body.data[4].informasi,
						subtitle: body.data[4].detail,
						imageUrl: body.data[4].image
					}, {
						title: body.data[5].informasi,
						subtitle: body.data[5].detail,
						imageUrl: body.data[5].image
					}, {
						title: body.data[6].informasi,
						subtitle: body.data[6].detail,
						imageUrl: body.data[6].image
					}, {
						title: body.data[7].informasi,
						subtitle: body.data[7].detail,
						imageUrl: body.data[7].image
					}]
				}, {
					type: 'quickReplies',
					content: {
						title: 'apa ada lagi informasi yang dibutuhkan? :)',
						buttons: [{
							title: 'Daftar Informasi',
							value: 'menu awal'
						}]
					}
				}]).then() : res.send({ reply: content });
			});
		} else {
			return message ? message.reply([{
				type: 'text',
				content: 'Informasi tidak tersedia :('
			}, {
				type: 'quickReplies',
				content: {
					title: 'Coba lihat daftar informasi untuk melihat informasi yang tersedia :)',
					buttons: [{
						title: 'Daftar Informasi',
						value: 'menu awal'
					}]
				}
			}]).then() : res.send({ reply: content });
		}
	});
};

var bot = exports.bot = function bot(body, response, callback) {
	console.log(body);

	if (body.message) {
		client.connect.handleMessage({ body: body }, response, replyMessage);
		callback(null, { result: 'Bot answered :)' });
	} else if (body.text) {
		replyMessage(null, body.text, response);
	} else {
		callback('No text provided');
	}
};