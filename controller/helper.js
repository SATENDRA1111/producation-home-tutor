const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  return new Promise((resolve,reject)=>{
    bcrypt.genSalt(10,(err,salt)=>{
      if(err){
        reject(err)
      }
      bcrypt.hash(password,salt,(err,hash)=>{
        if(err) reject(err);
        resolve(hash);
      })
    })
  })
 
};

 const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
    comparePassword,hashPassword
}