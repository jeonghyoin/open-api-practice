//토큰 인증 부분 
const jwt = require('jsonwebtoken')
var tokenKey = "fintech!@#$%"

const authMiddleware = (req, res, next) => {
   const token = req.headers['x-access-token'] || req.query.token;
   console.error(token)
   if(!token) {
       return res.status(403).json({
           success: false,
           message: 'not logged in'
       })
   }
   const p = new Promise(
       (resolve, reject) => {
           jwt.verify(token, tokenKey, (err, decoded) => {
               if(err) reject(err)
               resolve(decoded)
           })
       }
   )
   const onError = (error) => {
       console.log(error);
       res.status(403).json({
           success: false,
           message: error.message
       })
   }
   p.then((decoded)=>{
       req.decoded = decoded
       next()
   }).catch(onError)
}
module.exports = authMiddleware;
