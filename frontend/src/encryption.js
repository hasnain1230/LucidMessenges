import forge from 'node-forge';

export const generateKeyPair = () => {
  const keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
  return {
    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keypair.privateKey)
  };
};

export const encryptMessage = (publicKeyPem, message) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const symmetricKey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);
  
  const cipher = forge.cipher.createCipher('AES-CBC', symmetricKey);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(message));
  cipher.finish();
  
  const encryptedMessage = cipher.output.getBytes();
  const encryptedSymmetricKey = publicKey.encrypt(symmetricKey, 'RSA-OAEP');
  
  return {
    encryptedSymmetricKey: forge.util.encode64(encryptedSymmetricKey),
    encryptedMessage: forge.util.encode64(iv + encryptedMessage)
  };
};

export const decryptMessage = (privateKeyPem, encryptedSymmetricKey, encryptedMessage) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  
  const symmetricKey = privateKey.decrypt(forge.util.decode64(encryptedSymmetricKey), 'RSA-OAEP');
  const encryptedData = forge.util.decode64(encryptedMessage);
  const iv = encryptedData.slice(0, 16);
  const data = encryptedData.slice(16);
  
  const decipher = forge.cipher.createDecipher('AES-CBC', symmetricKey);
  decipher.start({iv: iv});
  decipher.update(forge.util.createBuffer(data));
  decipher.finish();
  
  return decipher.output.toString();
};