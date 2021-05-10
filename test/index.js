const path = require("path");
const { Application } = require("spectron");
const electronBinary = require("electron");
require("chai").should();

// construct paths
const baseDir = path.join(__dirname, "..", "src");

describe("When Application launch", function () {
  this.timeout(10000);

  const app = new Application({
    path: electronBinary,
    args: [baseDir],
  });
  const validHashStub = "access code hash";
  const privKeyStub = "valid private key";
  const encryptedCodeStub = "encrypted access code";
  const decryptedAccessCode = "azerty";
  const hashValidityMessage = "code is valid";

  this.beforeAll(() => app.start());

  this.afterAll(() => app.stop());

  it("Should shows an initial window", async () => {
    await app.client.waitUntilWindowLoaded();
    const windowNumber = await app.client.getWindowCount();
    windowNumber.should.be.equal(1);
  });

  it("Forms should be filled correctly", async () => {
    await app.client.waitUntilWindowLoaded();
    const { privKeyField, hashField, encryptedCodeField } = await fillInputs(
      app,
      validHashStub,
      privKeyStub,
      encryptedCodeStub
    );

    let retrievedPrivKey = await privKeyField.getValue();
    retrievedPrivKey.should.be.equal(privKeyStub);
    let retrievedHash = await hashField.getValue();
    retrievedHash.should.be.equal(validHashStub);
    let retrievedEncryptedCode = await encryptedCodeField.getValue();
    retrievedEncryptedCode.should.be.equal(encryptedCodeStub);
  });

  it("Correct input should display decrypted access code", async () => {
    await app.client.waitUntilWindowLoaded();
    const decryptedCodeField = await app.client.$("#codeDisplay");

    (await decryptedCodeField.getText()).should.be.empty;

    const valueFromMain = { code: decryptedAccessCode, isValid: hashValidityMessage };
    app.webContents.send("getCode", valueFromMain);

    (await decryptedCodeField.getText()).should.contains(decryptedAccessCode);
    (await decryptedCodeField.getText()).should.contains(hashValidityMessage);
  });
});

async function fillInputs(app, validHashStub, privKeyStub, encryptedCodeStub) {
  const hashField = await app.client.$("#hash");
  const privKeyField = await app.client.$("#key");
  const encryptedCodeField = await app.client.$("#password");

  await hashField.setValue(validHashStub);
  await privKeyField.setValue(privKeyStub);
  await encryptedCodeField.setValue(encryptedCodeStub);
  return { privKeyField, hashField, encryptedCodeField };
}
