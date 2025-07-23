const express = require('express');
const app = express();
const morgan = require('morgan');

const anneeAcademiqueRouter = require('./routes/anneAcademiqueRoutes');
const filiereRouter = require('./routes/filiereRoutes');
const classeRouter = require('./routes/classeRoutes');
const userRouter = require('./routes/userRoutes');
const studentRouter = require('./routes/studentRoutes');
const courRouter = require('./routes/courRoutes');
const enseignantRouter = require('./routes/enseignantRouter');
const evaluationRouter = require('./routes/evaluationRoutes');
const bulletinRouter = require('./routes/bulletinRoutes');
const paiementRouter = require('./routes/paiementRoutes');
const factureRouter = require('./routes/factureRouter');

const globalErrorHandler = require('./controllers/errorController');

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/api/v1/anneeAcademiques', anneeAcademiqueRouter);
app.use('/api/v1/filieres', filiereRouter);
app.use('/api/v1/classes', classeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/cours', courRouter);
app.use('/api/v1/enseignants', enseignantRouter);
app.use('/api/v1/evaluations', evaluationRouter);
app.use('/api/v1/bulletins', bulletinRouter);
app.use('/api/v1/paiements', paiementRouter);
app.use('/api/v1/factures', factureRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
