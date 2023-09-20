const mongoose =require('mongoose')
const colors =require('colors')

const connectDB=async()=>{
    try {
     await mongoose.connect(process.env.MONGO_URL);  
     console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.black); 
    } catch (error) {
        console.log(`Mongodv server issue ${error}`.bgRed.white)
    }
};

module.exports=connectDB;