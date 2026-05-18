//create HTTP server
import exp from 'express';
import { connect } from 'mongoose';
import dns from 'dns';
import { config } from 'dotenv';
import { UserApp } from './APIs/UserAPI.js';
import cors from 'cors'

// Force DNS resolution through public servers for Atlas SRV lookup
dns.setServers(['8.8.8.8', '1.1.1.1'])
console.log('DNS servers:', dns.getServers())

//Read environment variables
config();
const app = exp()
//add cors
app.set('trust proxy',true);
app.use(cors({
    origin:['http://localhost:5173','https://user-management-app-two-mu.vercel.app'],
    credentials:true
}))
//add body parser middleware
app.use(exp.json())
//forward req to UserAPI if path starts with /user-api
 app.use('/user-api', UserApp)
//connect db

async function connectDB() {
    if (!process.env.DB_URL) {
        console.error('Missing DB_URL in environment variables.')
        process.exit(1)
    }

    try {
        await connect(process.env.DB_URL)
        console.log('DB connected')
        const port = process.env.PORT || 4000
        app.listen(port, () => console.log(`Server on port ${port}`))
    } catch (err) {
        console.error('Error in DB connection:', err.message || err)
        process.exit(1)
    }
}

connectDB()
//add error handling middleware
app.use((err,req,res,next)=>{
    //mongoose validation error
    if(err.name==='ValidationError'){
        return res.status(400).json({
            message:"Validation failed",
            errors:err.errors,
        });
    }

    //Invalid ObjectID
    if(err.name==="CastError"){
        return res.status(400).json({
            message:"Invalid ID format"
        })
    }

    //Duplicate key
    if(err.code===11000){
        return res.status(409).json({
            message:"Duplicate field value"
        })
    }
    res.status(500).json({
        message:"Internal server error"
    })
    
})