require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const connectDb=require('./config/db.js');
const authRoutes=require('./modules/auth/routes/auth.routes.js')

const app=express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// cors for any frontend
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(',') || '*',
    credentials:true   // allow cookies
}));

app.use(morgan('dev'));

// routes placeholder
app.get('/',(req,res)=>{
    res.send('API is working...');
});

// API routes
app.use('/api/auth',authRoutes);

// connect DB and start the server
const PORT=process.env.PORT || 5000;
connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running on port: ${PORT}`)
    })
})