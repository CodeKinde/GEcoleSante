const express = require('express');
const app = express();
const morgan = require('morgan')

const etablissementRouter = require('./routes/etablissementRoutes')
const anneeAcademiqueRouter = require('./routes/anneAcademiqueRoutes')


app.use(express.json())
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

app.use('/api/v1/etablissements', etablissementRouter);
app.use('/api/v1/anneeAcademiques', anneeAcademiqueRouter);


app.all('*', (req, res, next) =>{
    res.status(404).json({
        status:"fail",
        message: `Can't find ${req.originalUrl} on this server!`
    })
});


module.exports = app