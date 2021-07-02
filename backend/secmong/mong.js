const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const effds = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const idfgv = crypto.randomBytes(16);

exports.enc = (text) => {
  const cipher = crypto.createCipheriv(algorithm, effds, idfgv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    inv: idfgv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

exports.lor = (hash) => {
   const decipher = crypto.createDecipheriv(
    algorithm,
    effds,
    Buffer.from('85fa73eb8547f53f322431ed7edb78d7', "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};
