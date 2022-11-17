const jwt = require('jsonwebtoken')
const { User } = require('./connection')
const { JWT_SECRET } = process.env

const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        sub: user.id,
        uuid: user.uuid,
        verified: user.verified
      },
      JWT_SECRET,
      { expiresIn: '2h' },
      (err, tokenResult) => (err ? reject(err) : resolve(tokenResult))
    )
  })
}

const checkForToken = (ctx) => {
  try {
    const bearerHeader = ctx.request.headers.authorization.split(' ')[1]
    return bearerHeader
  } catch (err) {
    ctx.throw(403)
  }
}

const emailExists = async (user) => {
  const users = await User.findAll({
    where: {
      email: user.email
    }
  })
  if (users.length > 0) {
    return true
  } else {
    return false
  }
}

const usernameExists = async (user) => {
  const users = await User.findAll({
    where: {
      username: user.username
    }
  })
  if (users.length > 0) {
    return true
  } else {
    return false
  }
}

module.exports = {
  generateToken,
  checkForToken,
  emailExists,
  usernameExists
}
