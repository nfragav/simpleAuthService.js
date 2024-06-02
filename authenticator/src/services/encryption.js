const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const CustomErrorResponse = require('../errors/customErrorResponse');

const encryptParams = {
  emailSecret: process.env.EMAIL_SECRET,
  emailAlgorithm: process.env.EMAIL_CRYPTO_ALGORITHM,
  emailHashSecret: process.env.EMAIL_HASH_SECRET,
  passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS),
}


const hashEmail = (email) => {
  return crypto.createHmac('sha256', encryptParams.emailHashSecret).update(email).digest('hex');
}

const encryptString = (string, secret, algorithm) => {
  const init_vector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, init_vector);
  let encryptedData = cipher.update(string, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return `${init_vector.toString('hex')}:${encryptedData}`;
}

const decryptEmail = (encryptedEmail) => {
  const [init_vector, encryptedData] = encryptedEmail.split(':');
  const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(init_vector, 'hex'))
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

const encryptUserDataInPlace = async (ctx) => {
  console.log("Hashing user info in ctx for safe manage...");

  if (ctx.request.body.password) {
    const {password} = ctx.request.body;
    ctx.request.body.password = await bcrypt.hash(
      password,
      encryptParams.passwordSaltRounds
    );
  }

  if (ctx.request.body.email) {
    const {email} = ctx.request.body;
    ctx.request.body.hashedEmail = hashEmail(email);
    ctx.request.body.email = encryptString(
      email,
      encryptParams.emailSecret,
      encryptParams.emailAlgorithm
    );
  }
}

const comparePassword = async (password, hash) => {
  const passwordMatch = await bcrypt.compare(password, hash);
  if (!passwordMatch) {
    throw new CustomErrorResponse(401, 'Username or password is incorrect');
  }
}


module.exports = { hashEmail, encryptUserDataInPlace, decryptEmail, comparePassword };