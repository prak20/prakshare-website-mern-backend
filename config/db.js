require('dotenv').config()

const mongoose=require("mongoose");

const connectDB = ()=> {
    // DATABASE CONNECTION
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true});
    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log('DB Connected.')
    }).catch(err=>{
        console.log('Connection Failed.')
    })
}
module.exports=connectDB;