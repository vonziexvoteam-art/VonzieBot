const ascii = `
╭╮╱╭╮╱╱╱╱╭━┳╮╱╭╮╭┳━╮╱╱
┃╰┳╯┣━┳━┳╋━┣╋━╋╮╭┫╭╋┳╮
╰╮┃╭┫╋┃┃┃┃━┫┃┻╋╯╰┫╰┫╭╯
╱╰━╯╰━┻┻━┻━┻┻━┻╯╰┻━┻╯╱
╭━┳╮╱
┃━┫╰╮
┣━┃┃┃
╰━┻┻╯
`;

const chalk = require("chalk");

const Connecting = async ({
  update,
  conn,
  Boom,
  DisconnectReason,
  sleep,
  color,
  clientstart
}) => {
  const {
    connection,
    lastDisconnect
  } = update;

  if (connection === "close") {
    const statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;
    console.log(color(lastDisconnect.error, "deeppink"));

    if (lastDisconnect.error === "Error: Stream Errored (unknown)") {
      process.exit();
    } else if (statusCode === DisconnectReason.badSession) {
      console.log(chalk.red.bold("Bad session file, please delete session and scan again."));
      process.exit();
    } else if (statusCode === DisconnectReason.connectionClosed) {
      console.log(chalk.red.bold("Connection closed, reconnecting..."));
      process.exit();
    } else if (statusCode === DisconnectReason.connectionLost) {
      console.log(chalk.red.bold("Connection lost, trying to reconnect."));
      process.exit();
    } else if (statusCode === DisconnectReason.connectionReplaced) {
      console.log(chalk.red.bold("Connection replaced, another new session opened. Please close current session first."));
      conn.logout();
    } else if (statusCode === DisconnectReason.loggedOut) {
      console.log(chalk.red.bold("Device logged out. Please scan again and run."));
      conn.logout();
    } else if (statusCode === DisconnectReason.restartRequired) {
      console.log(chalk.yellow.bold("Restart required, restarting..."));
      await clientstart();
    } else if (statusCode === DisconnectReason.timedOut) {
      console.log(chalk.yellow.bold("Connection timed out, reconnecting..."));
      clientstart();
    }

  } else if (connection === "connecting") {
    console.log(chalk.blue.bold("Connecting . . ."));

  } else if (connection === "open") {
    // Follow newsletters
    conn.newsletterFollow("120363419085046817@newsletter");
    conn.newsletterFollow("120363400475225779@newsletter");
    conn.newsletterFollow("120363398794401396@newsletter");
    conn.newsletterFollow("120363405490628750@newsletter");
    conn.newsletterFollow("120363418781353853@newsletter");

    console.log(ascii);
    console.log(chalk.blue.bold("Bot by Vonzie berhasil tersambung"));
  }
};

module.exports = {
  Connecting
};