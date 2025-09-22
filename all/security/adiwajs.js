const fs = require("fs");
const chalk = require("chalk");
const config = require("./adiwConfig");

let approvalTimeout;

async function checkApproval() {
  if (fs.existsSync(config.filePath)) {
    if (approvalTimeout) {
      clearTimeout(approvalTimeout);
    }
    return;
  } else {
    console.log(chalk.blue.bold("Script Membutuhkan Persetujuan Dari Creator, Jika Kamu Sudah Membeli Script Dari " + chalk.yellow.bold("(Creator)") + " Maka Akan Otomatis Di Setujui!"));
    console.log(chalk.cyan.bold("Credits:"));
    approvalTimeout = setTimeout(() => {
      if (fs.existsSync(config.filePath)) {
        clearTimeout(approvalTimeout);
      } else {
        console.log(chalk.red.bold("Script tidak disetujui oleh creator (jika script sudah disetujui restart agar script berjalan lancar)"));
        process.exit(1);
      }
    }, 60000);
  }
}

async function approveScript(sender, approvalData) {
  if (sender.includes(config.approval.num)) {
    if (!fs.existsSync(config.filePath)) {
      fs.writeFileSync(config.filePath, approvalData);
      console.log(chalk.green.bold("Script disetujui oleh creator, Silahkan Ulang Atau Restart Script!, Terimakasih Sudah Membeli Script Ini Langsung Ke Creator"));
      console.log(chalk.cyan.bold("Credits:"));
      if (approvalTimeout) {
        clearTimeout(approvalTimeout);
      }
    } else if (approvalTimeout) {
      clearTimeout(approvalTimeout);
    }
  } else {
    console.log(chalk.red.bold("Nomor pengirim tidak sesuai"));
  }
}

async function isApproved() {
  return fs.existsSync(config.filePath);
}

async function validateApprovalData(approvalData) {
  const readFile = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(config.filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data.toString());
      });
    });
  };

  const fileData = await readFile();
  if (fileData !== approvalData) {
    fs.unlinkSync(config.filePath);
    checkApproval();
  }
}

async function checkScriptIntegrity() {
  try {
    const fileContent = fs.readFileSync(config.checkFilePath, "utf8");
    if (!fileContent.includes(config.codeToDetect)) {
      console.log(chalk.red.bold("Terjadi Error, Mungkin Kode Approval Terhapus?, Jika Iya Silahkan Hubungi Creator Untuk Memperbaiki. Jika Tidak Ada Kode Approval Maka Script Tidak Bisa Dijalankan"));
      console.log(chalk.cyan.bold("Credits:"));
      process.exit(1);
    }
  } catch (error) {
    return;
  }
}

const scriptSecurity = {
  checkApproval,
  approveScript,
  isApproved,
  validateApprovalData,
  checkScriptIntegrity,
};

module.exports = scriptSecurity;

console.log(chalk.cyan.bold("Module scriptSecurity loaded successfully - Credits:"));