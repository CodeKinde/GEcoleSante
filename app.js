const express = require('express');
const app = express();
const morgan = require('morgan')

const etablissementRouter = require('./routes/etablissementRoutes')
const anneeAcademiqueRouter = require('./routes/anneAcademiqueRoutes')
const filiereRouter = require('./routes/filiereRoutes');
const classeRouter = require('./routes/classeRoutes')
const userRouter = require('./routes/userRoutes')
const studentRouter = require('./routes/studentRoutes')
const courRouter = require('./routes/courRoutes')


const globalErrorHandler = require('./controllers/errorController')




app.use(express.json())
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}
app.use((req, res, next) =>{
    req.requesTime = new Date().toISOString();
    // console.log(req.headers);
    next()
})

app.use('/api/v1/etablissements', etablissementRouter);
app.use('/api/v1/anneeAcademiques', anneeAcademiqueRouter);
app.use('/api/v1/filieres', filiereRouter);
app.use('/api/v1/classes', classeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/cours', courRouter);







app.all('*', (req, res, next) =>{
    res.status(404).json({
        status:"fail",
        message: `Can't find ${req.originalUrl} on this server!`
    })
});

app.use(globalErrorHandler)


module.exports = app