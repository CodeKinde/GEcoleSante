const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const app = require('./app');
const DATABASE = process.env.DATABASE;

const DATABASE_LOCAL = process.env.DATABASE_LOCAl;

const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
process.on('uncaughtException', err =>{
    console.log("EXCEPTION INATTRAPPEE ! 💥 Arrêt...");
    console.log(err.name, err.message);
    process.exit(1)    
})
let DB;
if(process.env.NODE_ENV === "development"){
    DB = DB = DATABASE.replace(
        '<PASSWORD>',
        DATABASE_PASSWORD
    );
}

if(process.env.NODE_ENV === "production"){
   DB =DATABASE_LOCAL
}

mongoose.connect(DB, {
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log("DB connection successfully"));

const port = process.env.PORT;
const server = app.listen(port, () =>{
    console.log(`App running on port ${port}`);
}) 

process.on('unhandledRejectio', err =>{
    console.log("REJET NON GÉRÉ ! 💥 Arrêt...");
    console.log(err.name, err.message);
    server.close(() =>{
        process.exit(1)
    })
    
    
})