const recastai = require('recastai').default
const client = new recastai(process.env.REQUEST_TOKEN)
const request = require('request')

const replyMessage = (message, text, res) => {
  const recastaiReq = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  const content = (message ? message.content : text)
  const type = message.type


  recastaiReq.analyseText(content)
    .then(recastaiRes => {
      const intent = recastaiRes.intent()
      console.log(intent)

      if (intent && intent.slug === 'greetings') {
		
        const reply = {
          type: 'quickReplies',
		  content: {
			title: 'Hai, apa yang kamu butuhkan? :)',
			buttons: [
			  {
				title: 'Daftar Informasi',
				value: 'menu awal',
			  }
			]
		  }
        }

        return message ? message.reply([reply]) : res.json({ reply: 'Hi, apa yang kamu butuhkan? :)' })
		
      }
	  
	  if (intent && intent.slug === 'disagree') {
		 const reply = {
          type: 'text',
		  content: 'oke, terimakasih :)' 
		  }

        return message ? message.reply([reply]) : res.send({ reply: 'Hi :)' })
		
	  }
	  
	  if (intent && intent.slug === 'agree') {

		 const reply = {
          type: 'quickReplies',
		  content: {
			title: 'Silahkan lihat daftar informasi untuk melihat informasi lainnya :)',
			buttons: [
			  {
				title: 'Daftar Informasi',
				value: 'menu awal',
			  }
			]
		  }
        }

        return message ? message.reply([reply]) : res.send({ reply: 'Hi :)' })
	  }
	  
	  if (intent && intent.slug === 'thanking') {
		 const reply = {
          type: 'text',
		  content: 'sama-sama :)' 
		  }

        return message ? message.reply([reply]) : res.send({ reply: 'Hi :)' })
		
	  }
	  
	  if(recastaiRes.entities.hasOwnProperty('menu')) {
		 
              return message ? message.reply([
			  { 
				type: 'carousel',
				  content: [
					{
					title: 'Informasi tentang jurusan',
					subtitle: 'Pilih informasi yang kamu butuhkan',
					imageUrl: 'http://politeknik.or.id/upload/39/galeri/gal_39-06-02-20171.jpg',
					buttons: [
					  {
						title: 'Dosen',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'dosen',
					  },
					  {
						title: 'Laboratorium',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'laboratorium',
					  },
					  {
						title: 'Struktur Organisasi',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'struktur organisasi',
					  }
					],
				  },
				  {
					title: 'Informasi tentang akademik',
					subtitle: 'Pilih informasi yang kamu butuhkan',
					imageUrl: 'http://politeknik.or.id/upload/39/galeri/gal_39-06-02-20171.jpg',
					buttons: [
					  {
						title: 'Kurikulum',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'kurikulum',
					  },
					  {
						title: 'Jadwal Kuliah',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'jadwal',
					  },
					  {
						title: 'Pendaftaran kuliah',
						type: 'postback', // 'postback', 'web_url' or 'phonenumber'
						value: 'pendaftaran',
					  }
					],
				  },
				  ],  
			  }
			  
			  ]).then() : res.send({ reply: content })
	  
      }else if(recastaiRes.entities.hasOwnProperty('jadwal')) {
		  request('http://tipolindrachatbot.000webhostapp.com/api/v1/informasi/jadwal', (_err, _res, body) => {
		  
          body = JSON.parse(body)
		  
		  return message ? message.reply([
			  { 
				type: 'text', content: 'oke, ini adalah jadwal kuliah jurusan TI POLINDRA'
			  },
			  {
			  type: 'card',
			  content: {
				title: body.data[0].detail,
				buttons: [
				  {
					title: 'Lihat Jadwal',
					type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
					value: body.data[0].link,
				  }
				],
			  },
			  },
			  {
			  type: 'quickReplies',
			  content: {
				title: 'apa ada lagi informasi yang dibutuhkan? :)',
				buttons: [
				  {
					title: 'Daftar Informasi',
					value: 'menu awal',
				  }
				]
			  }
			  }
			  ]).then() : res.send({ reply: content })
	    })  
	  }else if(recastaiRes.entities.hasOwnProperty('kurikulum')) {
		  request('http://tipolindrachatbot.000webhostapp.com/api/v1/informasi/kurikulum', (_err, _res, body) => {
		  
          body = JSON.parse(body)
		  
		  return message ? message.reply([
			  { 
				type: 'text', content: 'oke, ini adalah kurikulum yang ada pada jurusan TI POLINDRA'
			  },
			  {
			  type: 'carousel',
			  content: [
			  {
				title: body.data[0].informasi,
				buttons: [
				  {
					title: 'kurikulum',
					type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
					value: body.data[0].link,
				  },
				  {
					title: 'Detail tentang D3',
					type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
					value: body.data[0].detail,
				  }
				],
			  },
			  {
				title: body.data[1].informasi,
				buttons: [
				  {
					title: 'kurikulum',
					type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
					value: body.data[1].link,
				  },
				  {
					title: 'Detail tentang D4',
					type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
					value: body.data[1].detail,
				  }
				],
			  }
			  ]
			  },
			  {
			  type: 'quickReplies',
			  content: {
				title: 'apa ada lagi informasi yang dibutuhkan? :)',
				buttons: [
				  {
					title: 'Daftar Informasi',
					value: 'menu awal',
				  }
				]
			  }
			  }
			  ]).then() : res.send({ reply: content })
	    })
	  }else if(recastaiRes.entities.hasOwnProperty('organisasi')) {
		request('http://tipolindrachatbot.000webhostapp.com/api/v1/informasi/struktur', (_err, _res, body) => {
		  
           body = JSON.parse(body)

		  return message ? message.reply([
			  { 
				type: 'text', content: 'oke, ini adalah struktur organisasi pada jurusan TI POLINDRA'
			  },
			  {
				type: 'picture', content: body.data[0].link,  
			  },
			  {
			  type: 'quickReplies',
			  content: {
				title: 'apa ada lagi informasi yang dibutuhkan? :)',
				buttons: [
				  {
					title: 'Daftar Informasi',
					value: 'menu awal',
				  }
				]
			  }
			  }
			  ]).then() : res.send({ reply: content })
	    })
	  }else if(recastaiRes.entities.hasOwnProperty('daftar')) {
        request('http://tipolindrachatbot.000webhostapp.com/api/v1/informasi/pendaftaran', (_err, _res, body) => {
		  
              body = JSON.parse(body)

              return message ? message.reply([
			  { 
				type: 'text', content: body.data[0].detail 
			  },
			  {
			  type: 'card',
			  content: {
				title: 'Untuk informasi selebihnya tentang pendaftarn bisa kunjungi website POLINDRA',
				buttons: [
				  {
					title: 'website polindra',
					type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
					value: 'https://www.polindra.ac.id/',
				  }
				],
			  },
			  },
			  {
			  type: 'quickReplies',
			  content: {
				title: 'apa ada lagi informasi yang dibutuhkan? :)',
				buttons: [
				  {
					title: 'Daftar Informasi',
					value: 'menu awal',
				  }
				]
			  }
			  }
			  ]).then() : res.send({ reply: content })

        })
       } else if (recastaiRes.entities.hasOwnProperty('laboratorium')) {
        request('http://tipolindrachatbot.000webhostapp.com/api/v1/informasi/lab', (_err, _res, body) => {
          
              body = JSON.parse(body)
        
              return message ? message.reply([
			  {
				  type: 'text',
				  content: 'oke, ini informasi tentang lab yang di TI POLINDRA :)'
			  },
			  { 
				type: 'carousel',
				  content: [
				  {
					title: body.data[0].informasi,
					subtitle: body.data[0].detail,
					imageUrl: body.data[0].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/pemrograman/2013/06/30/46/Laboratorium-Pemrograman.html',
					  }
					]
				  },
				  {
					title: body.data[1].informasi,
					subtitle: body.data[1].detail,
					imageUrl: body.data[1].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/basisdata.html',
					  }
					]
				  },
				  {
					title: body.data[2].informasi,
					subtitle: body.data[2].detail,
					imageUrl: body.data[2].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/jaringan-komputer/2013/06/30/47/Laboratorium-Jaringan-Komputer.html',
					  }
					]
				  },
				  {
					title: body.data[3].informasi,
					subtitle: body.data[3].detail,
					imageUrl: body.data[3].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/sistem-operasi/2013/07/18/65/Laboratorium-Sistem-Operasi.html',
					  }
					]
				  },
				  {
					title: body.data[4].informasi,
					subtitle: body.data[4].detail,
					imageUrl: body.data[4].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/it-terapan.html',
					  }
					]
				  },
				  {
					title: body.data[5].informasi,
					subtitle: body.data[5].detail,
					imageUrl: body.data[5].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/komputasi-dasar.html',
					  }
					]
				  },
				  {
					title: body.data[6].informasi,
					subtitle: body.data[6].detail,
					imageUrl: body.data[6].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/multimedia.html',
					  }
					]
				  },
				  {
					title: body.data[7].informasi,
					subtitle: body.data[7].detail,
					imageUrl: body.data[7].link,
					buttons: [
					  {
						title: 'Lihat Detail',
						type: 'web_url', // 'postback', 'web_url' or 'phonenumber'
						value: 'http://ti.polindra.ac.id/info/laboratorium/elektronika-dan-sistem-digital/2013/07/17/51/Elektronika-Dan-Sistem-Digital.html',
					  }
					]
				  },
				  ],
			  },
			  {
			  type: 'quickReplies',
			  content: {
				title: 'apa ada lagi informasi yang dibutuhkan? :)',
				buttons: [
				  {
					title: 'Daftar Informasi',
					value: 'menu awal',
				  }
				]
			  }
			  }
			  ]).then() : res.send({ reply: content })
        })
		
	  }else if(recastaiRes.entities.hasOwnProperty('dosen')) {
        request('http://tipolindrachatbot.000webhostapp.com/api/v1/informasi/dosen', (_err, _res, body) => {
          
              body = JSON.parse(body)
        
              return message ? message.reply([
			  {
				  type: 'text',
				  content: 'oke, ini informasi tentang staf pengajar yang ada di TI POLINDRA :)'
			  },
			  { 
				type: 'carousel',
				  content: [
				  {
					title: body.data[0].informasi,
					subtitle: body.data[0].detail,
					imageUrl: body.data[0].link,
				  },
				  {
					title: body.data[1].informasi,
					subtitle: body.data[1].detail,
					imageUrl: body.data[1].link,
				  },
				  {
					title: body.data[2].informasi,
					subtitle: body.data[2].detail,
					imageUrl: body.data[2].link,
				  },
				  {
					title: body.data[3].informasi,
					subtitle: body.data[3].detail,
					imageUrl: body.data[3].link,
				  },
				  {
					title: body.data[4].informasi,
					subtitle: body.data[4].detail,
					imageUrl: body.data[4].link,
				  },
				  {
					title: body.data[5].informasi,
					subtitle: body.data[5].detail,
					imageUrl: body.data[5].link,
				  },
				  {
					title: body.data[6].informasi,
					subtitle: body.data[6].detail,
					imageUrl: body.data[6].link,
				  },
				  {
					title: body.data[7].informasi,
					subtitle: body.data[7].detail,
					imageUrl: body.data[7].link,
				  },
				  ],
			  },
			  {
			  type: 'quickReplies',
			  content: {
				title: 'apa ada lagi informasi yang dibutuhkan? :)',
				buttons: [
				  {
					title: 'Daftar Informasi',
					value: 'menu awal',
				  }
				]
			  }
			  }
			  ]).then() : res.send({ reply: content })
        })
		
	  }else{
        return message ? message.reply([ {
          type: 'text',
		  content: 'Informasi tidak tersedia :('
        },
	    {
	      type: 'quickReplies',
     	  content: {
		  title: 'Coba lihat daftar informasi untuk melihat informasi yang tersedia :)',
			buttons: [
			  {
				title: 'Daftar Informasi',
				value: 'menu awal',
			  }
			]
		  }
		  }

        ]).then() : res.send({ reply: content })
      }
    })
}

export const bot = (body, response, callback) => {
  console.log(body)

  if (body.message) {
    client.connect.handleMessage({ body }, response, replyMessage)
    callback(null, { result: 'Bot answered :)' })
  } else if (body.text) {
    replyMessage(null, body.text, response)
  } else {
    callback('No text provided')
  }
}
