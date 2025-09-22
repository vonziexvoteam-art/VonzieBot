// Module
const fs = require('fs')

//Bot Settings
global.connect = true // True For Pairing // False For Qr
global.publicX = true // True For Public // False For Self
global.owner = ['62857734669112'] //Own Number
global.developer = "RyuMa" //Dev Name
global.botname = "Vonzie" //Bot Name
global.autoJoin = true
global.version = "0.0.0" //Version Bot
global.NameSaluran = "¡ª" //Name Saluran
global.idSaluran = "2272929388@newsletter" //Id Saluran
global.cd = '3000'; //Cooldown Jpmch
global.delayJpm = 3000; //Delay Jpmch

//Sticker Setiings
global.packname = "Sticker By RyuMa" //Pack Name 
global.author = "-" // Author

//Social Media Settings
global.codeInvite = "https://whatsapp.com/channel/0029Vb6KtdzG8l5M16Qpam3X"
global.ytube = "-"
global.ttok = "-"
global.igram = "-"
global.chtele = "-"
global.tgram = "https://t.me/RyuMa"

//Only Name Settings
global.mess = {
 owner: '*You are not the owner!!*',
 premium: '*You are not premium!!*',
 group: '*This feature is for groups only!!*'
}

//Subdomaik Setting
global.subdomain = {
"rizxvelz.online": {
"zone": "8eac5133e31d86027c631df0bccb9a05", 
"apitoken": "JAU5FRMKWDykRWXQq3lre4PzRjJUVLgbw1VfcEnv"
},
"rizxvelz.shop": {
"zone": "13cc550eaa6101a6865886e7b0c4be30", 
"apitoken": "DJ8xCUS1EmaO_e5RaagMXpaPP5asaVH0Tc9DHD7w"
},
"kenz-host.my.id": {
"zone": "df24766ae8eeb04b330b71b5facde5f4", 
"apitoken": "fyaxLxD0jNONtMWK3AmnaiLkkWi5Wg3Y9h8nqJh6"
},
"panelkishop.web.id": {
"zone": "8f4812b3c78ca478b5d162b6cb35d1b3", 
"apitoken": "3Y0cW3cVVIhyeWHytqFEbGDrdWaAC-k8twOEeFP2"
},
"tokopanelkishop.biz.id": {
"zone": "d87d4f320d9902f31fbbcc5ee23fafe8", 
"apitoken": "D00akOLxF3qzBzpYBp5SbpaLTmwYeybNsyAcDfiB"
},
"rikionline.shop": {
"zone": "082ec80d7367d6d4f7c52600034ac635", 
"apitoken": "r3XUyNYtxNQYwZtGUIAChRqe0uTzwV4eVO7JpJ_l"
}
}

//System Bot Settings
global.prefa = ['','!','.',',','?','?','/'] // Prefix // Not Change

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})