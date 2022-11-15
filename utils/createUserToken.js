const jwt = require('jsonwebtoken')

const createUserToken = async(user) =>{
    const token = await jwt.sign({data : user},'jwtsecretkey',{ expiresIn : '1h' })
    return token
}

module.exports = createUserToken