const bcrypt = require("bcryptjs");

 const hashPassword = async (password) => {
  try {
    // const saltRounds = 10;
    const salt =  await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    // console.log(error);
  }
};

 const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
    comparePassword,hashPassword
}