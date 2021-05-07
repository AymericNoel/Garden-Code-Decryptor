const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const EthCrypto = require("eth-crypto");
const crypto = require("crypto");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    resizable: false,
    width: 950,
    height: 600,
    icon: __dirname + "/favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // remove menu items
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Even listener from index.html
  ipcMain.on("getData", async (event, data) => {
    const code = await decryptMessage(data.key, data.password);
    if (code !== null) {
      const validity = verifyHash(data.hash, code);
      const returnValue = { code: code, isValid: validity };
      mainWindow.webContents.send("getCode", returnValue);
    } else {
      mainWindow.webContents.send("privKeyError");
    }
  });
};

/**
 * Function that uses Crypto library to verify hash equality between the retrieved garden access code from blockchain
 * and the decrypted garden access code from user.
 *
 * @param {string} retrievedHash The hash of the garden access code retrieved from blockchain
 * @param {number} code The garden access code decrypted with user's private key
 * @return {string} The validity of the equality
 */
function verifyHash(retrievedHash, code) {
  let isValid;
  try {
    let hash = crypto.createHash("sha256").update(code).digest("hex");
    hash = "0x" + hash;
    isValid =
      hash === retrievedHash
        ? "Code Valide"
        : "Code Invalide, veuillez contacter les administrateurs et ouvrir un litige";
  } catch (error) {
    isValid = "Hash Invalide";
  }

  return isValid;
}

/**
 * Function that uses eth-crypto library to decrypt message crypted with public key.
 *
 * @param {string} privateKey The user's ethereum private key
 * @param {string} encryptedCode The encrypted garden access code
 * @return {number} The decrypted garden access code
 */
async function decryptMessage(privateKey, encryptedCode) {
  let decryptedMessage;
  try {
    const encryptedObject = EthCrypto.cipher.parse(encryptedCode);
    decryptedMessage = await EthCrypto.decryptWithPrivateKey(
      privateKey,
      encryptedObject
    );
  } catch (error) {
    decryptedMessage = null;
  }

  return decryptedMessage;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
