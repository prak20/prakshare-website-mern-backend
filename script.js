const File=require('./models/file')
const fs=require('fs')

const connectDB = require('./config/db')
connectDB();

const fetchData=async()=>{
    // 24 hours
    const pastDate=new Date(Date.now() - (24*60*60*1000))
    const files=await File.find({
        createdAt: { $lt: pastDate}
    })
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path)
                await file.remove()
                console.log(`Sucessfully Deleted ${file.filename}`)
            } catch(err){
                console.log(`${err} Error occured while Deleting file `)
            }
        }
        console.log('Work Done')
    }
}
fetchData().then(process.exit)