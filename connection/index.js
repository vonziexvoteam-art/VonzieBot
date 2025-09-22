
const { default: makeWASocket, DisconnectReason, makeInMemoryStore, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("@whiskeysockets/baileys");

const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs');
const readline = require("readline");
const PhoneNumber = require('awesome-phonenumber');

//====[ Password Settings ]====//
const pw = "nopw"; // Ganti jadi "nopw" atau "no pw" untuk menonaktifkan password

const { Boom } = require('@hapi/boom');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./lib/exif')
const { smsg, sleep, getBuffer, botTerkoneksi } = require('./lib/func')


const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
};
//
async function startSesi() {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState("session")
    const ryu = makeWASocket({
        logger: pino({
            level: "silent"
        }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });


if (!ryu.authState.creds.registered) {
    if (pw !== "nopw" && pw !== "no pw") {
        const password = await question(`\nMasukan Password Yang Valid:\n`);
        if (password !== pw) {
            console.log(`✖️ Access Denied`);
            process.exit();
        }
    }

    const phoneNumber = await question('Masukan Nomor Dengan Kode Negara:\n');
    let code = await ryu.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`CODE PAIRING :`, code);
}
    store.bind(ryu.ev)

    ryu.ev.on('messages.upsert', async chatUpdate => {
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!ryu.public && mek.key.remoteJid !== global.owner + "@s.whatsapp.net" && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            m = smsg(ryu, mek, store)
            require("../command/case")(ryu, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
        ryu.public = true

    ryu.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    ryu.getName = (jid, withoutContact = false) => {
        id = ryu.decodeJid(jid)
        withoutContact = ryu.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = ryu.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === ryu.decodeJid(ryu.user.id) ?
            ryu.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    ryu.serializeM = (m) => smsg(ryu, m, store);
    ryu.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.badSession || reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
                startSesi();
            } else if (reason === DisconnectReason.loggedOut) {} else {
                ryu.end(`Unknown DisconnectReason: ${reason}|${connection}`);
            }
        } else if (connection === 'open') {


const frames = [
  '▁ ▂ ▃ ▄ ▅ ▆ ▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁  || Loading',
  '▂ ▃ ▄ ▅ ▆ ▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂  || Loading',
  '▃ ▄ ▅ ▆ ▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃  || Loading',
  '▄ ▅ ▆ ▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄  || Loading',
  '▅ ▆ ▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅  || Loading',
  '▆ ▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆  || Loading',
  '▇ ▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆ ▇  || Loading',
  '▆ ▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆ ▇ ▆  || Loading',
  '▅ ▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆ ▇ ▆ ▅  || Loading',
  '▄ ▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆ ▇ ▆ ▅ ▄  || Loading',
  '▃ ▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆ ▇ ▆ ▅ ▄ ▃  || Loading',
  '▂ ▁ ▁ ▂ ▃ ▄ ▅ ▆ ▇ ▆ ▅ ▄ ▃ ▂  || Loading'
];



let i = 0;
const intervalTime = 400; // milidetik
const totalDuration = 4000; // total animasi 4 detik

console.clear();

const interval = setInterval(() => {
  console.clear();
  console.log(chalk.bold.hex('#FF8C00')(frames[i % frames.length]));
  i++;
}, intervalTime);

setTimeout(() => {
  clearInterval(interval);
  console.clear();

  

console.log(
  '\n' +
  chalk.bold.hex('#FF6F00').underline('Bot Terhubung Ke Server') + '\n\n' +

  chalk.white.bold('Base By: ') + chalk.hex('#1E90FF').underline('Lezz DcodeR') + '\n' +

  chalk.white.bold('Optimization By: ') + chalk.hex('#32CD32').underline('Gifzi.my.id') + '\n\n' +
  chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') + '\n' + chalk.white('ketik .menu untuk menampilkan menu')
);

}, totalDuration);

botTerkoneksi(ryu);
        }
    });
    //
    ryu.ev.on('creds.update', saveCreds)

    ryu.sendText = (jid, text, quoted = '', options) => ryu.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted
    })

    ryu.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await addExif(buff);
        }
        
        await ryu.sendMessage(jid, { 
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };

    ryu.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }

        await ryu.sendMessage(jid, {
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };

    ryu.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }

    return ryu
}
// Anu
startSesi();

//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
