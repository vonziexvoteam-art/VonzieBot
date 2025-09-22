require('./config')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeCacheableSignalKeyStore, makeInMemoryStore, jidDecode, proto, getAggregateVotesInPollMessage } = require("@whiskeysockets/baileys");
const pino = require('pino')
const chalk = require('chalk')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const FileType = require('file-type')
const readline = require("readline");
const PhoneNumber = require('awesome-phonenumber')
const path = require('path')
const NodeCache = require("node-cache")
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./System/Data1.js')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./System/Data2.js')
const usePairingCode = global.connect // true pairing // false qr
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})
};
//===================
const jadibot = async (Ryc, m, from)  => {
Ryc.client = Ryc.client ? Ryc.client : {}
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState(`./sesijadibot/jadibot/${m.sender.split("@")[0]}`)
	  Ryc.client[from] = makeWASocket({
		printQRInTerminal: !usePairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000,
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
		generateHighQualityLinkPreview: true,
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage ||
				message.templateMessage ||
				message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}

			return message;
		},
		version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
		browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({
			level: 'fatal'
		}),
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({
				level: 'silent',
				stream: 'store'
			})),
		}
	});
if (!Ryc.client[from].authState.creds.registered) {
setTimeout(async () => {
    const code = await Ryc.client[from].requestPairingCode(m.sender.split("@")[0])
    let peler = `${code}`
m.reply(peler)
}, 30000)
}
 
const store = makeInMemoryStore({ 
    logger: pino().child({ 
        level: 'silent', 
        stream: 'store' 
    })
})
     
store.bind(Ryc.client[from].ev)
    
Ryc.client[from].ev.on('messages.upsert', async chatUpdate => {
try {
let mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!Ryc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(Ryc.client[from], mek, store)
require("./TamaC")(Ryc.client[from], m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})
//===================
Ryc.client[from].ev.on('call', async (caller) => {
console.log("Invite to Call")
})
Ryc.client[from].decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

Ryc.client[from].getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
//if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
filename = path.join(__filename, '../' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data
}}

Ryc.client[from].downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 

Ryc.client[from].sendText = (jid, text, quoted = '', options) => Ryc.sendMessage(jid, { text: text, ...options }, { quoted })
    
Ryc.client[from].sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
await Ryc.client[from].sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

Ryc.client[from].sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)}
await Ryc.client[from].sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

Ryc.client[from].downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName}
// Message
// Self Public
Ryc.public = global.publicX
// Connect
Ryc.client[from].serializeM = (m) => smsg(Ryc.client[from], m, store)
    
	Ryc.client[from].ev.on("connection.update", async (update) => {
		const {
			connection,
			lastDisconnect
		} = update;
		if (connection === "close") {
			let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
			if (reason === DisconnectReason.badSession) {
				Ryc.sendMessage(m.chat, { text: `Kesalahan Pada Sessions, Hapus Sessions Dan Coba Lagi...` })
				stopbot(Ryc, m, from) 
			} else if (reason === DisconnectReason.connectionClosed) {
				Ryc.sendMessage(m.chat, { text: "Koneksi Ditutup, Menghubungkan Ulang...." })
				jadibot(Ryc, m, from)
			} else if (reason === DisconnectReason.connectionLost) {
				Ryc.sendMessage(m.chat, { text: "Koneksi Hilang dari Server, Menghubungkan Ulang..." })
				jadibot(Ryc, m, from)
			} else if (reason === DisconnectReason.connectionReplaced) {
				Ryc.sendMessage(m.chat, { text: "Sessions Terkoneksi Dengan Server Lain, Please Restart Bot." })
				stopbot(Ryc, m, from)
			} else if (reason === DisconnectReason.loggedOut) {
				Ryc.sendMessage(m.chat, { text: `Perangkat Keluar, Silakan Hapus Sesi Folder dan Pindai Lagi.` })
				stopbot(Ryc, m, from)
			} else if (reason === DisconnectReason.restartRequired) {
				Ryc.sendMessage(m.chat, { text: "Memuat Ulang Koneksi, Mulai Ulang..." })
				jadibot(Ryc, m, from)
			} else if (reason === DisconnectReason.timedOut) {
				Ryc.sendMessage(m.chat, { text: "Waktu Koneksi Habis, Menyambungkan Kembali..." })
				jadibot(Ryc, m, from)
			} else {
				console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
				jadibot(Ryc, m, from)
			}
		} else if (connection === "open") {
			console.log('Connected...', update)
		}
	});

    Ryc.client[from].ev.on('creds.update', saveCreds);
    Ryc.client[from].serializeM = (m) => smsg(Ryc.client[from], m, store);
    return Ryc.client[from];
}

const stopbot = async (Ryc, m, from) => {
if (!Ryc.client[from]) return m.reply("*Tidak ada bot yang sedang terkoneksi*")
fs.rm(`./sesijadibot/jadibot/${m.sender.split("@")[0]}`, { recursive: true, force: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  m.reply("Sessions berhasil dihapus")
});
delete Ryc.client[from]
m.reply("*Bot Stopped*")
}

async function listjadibot(Ryc, m) {
  let from = m.key.remoteJid
  let mentions = []
  let text = "List Jadi Bot :\n"
  for (let jadibot of Object.keys(Ryc.client)) {
    mentions.push(jadibot)
    text += ` × ${jadibot}\n`
  }
  return Ryc.sendMessage(from, { text: text.trim(), mentions, })
}


module.exports = { jadibot, stopbot, listjadibot }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
