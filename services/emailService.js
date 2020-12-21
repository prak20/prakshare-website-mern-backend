const nodemailer=require('nodemailer')
 const  sendMail =  async({from,to,subject,text,html})=>{
    let transporter=nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    let info=await transporter.sendMail({
        from: `PrakShare <${from}>`,
        to, // to: to,
        subject, // subject: subject,
        text, // text: text,
        html, // html: html,
    })
}
// We used sendinblue service to find host
module.exports=sendMail