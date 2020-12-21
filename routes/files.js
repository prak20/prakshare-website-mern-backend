const express=require('express')
const router=express.Router()
const multer=require('multer')
const path=require('path')
const File=require('../models/file')
const {v4: uuid4}=require('uuid')
let storage=multer.diskStorage({
    destination: (req,file,cb)=> cb(null,'uploads/'),
    filename: (req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
})
let upload=multer({
    storage,
    limit: {fileSize: 1000000 * 100},
}).single('myfile')


router.post('/',(req,res)=>{

    //STORE FILE
    upload(req,res,async (err)=>{
        
        //VALIDATING REQUEST
        if(!req.file){
            return res.json({
                error: 'All fields are required.'
            })
        }

        if(err){
            return res.status(500).send({
                error:err.message
            })
        }
        //STORE INTO DATABASE
        const file=new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        })
        //RESPONSE WE GET IN FORM OF DOWNLOAD LINK
        const response=await file.save()
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
        // http://localhost:3000/fies/2376788768hgf-55765867654hgfhg Like this
    })
})

router.post('/send',async (req,res)=>{
    const {uuid,emailTo,emailFrom}=req.body
    // VALIDATE RESPONSE
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: 'All fields are required'})
    }

    //GET DATA FROM DATABASE
    const file=await File.findOne({uuid:uuid})
    if(file.sender){
        return res.status(422).send({error: 'Email Already Sent !'})
    }
    file.sender=emailFrom
    file.receiver=emailTo
    const response=await file.save()

    // SEND EMAIL
    const sendMail=require('../services/emailService')
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'Prakshare File Sharing',
        text: `${emailFrom} Shared file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom, 
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`, 
            size: parseInt(file.size/1000)+'KB', 
            expires: '24 Hours'
        })
    })
    return res.send({success: true})
})

module.exports=router