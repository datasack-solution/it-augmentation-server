import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import adminRoutes from './routes/AdminRoutes';
import clientRoutes from './routes/clientRoutes';
import clientRoutesNew from './routes/clientRoutesNew';
require('dotenv').config();

export const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const allowedOrigins = [
  'https://it-augmentation-admin.vercel.app',
  'https://itstaffaugmentation.datasack.in',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://datasack.in/itstaffaugmentation',
  'https://datasack.in/'
];

app.use(cors({
  origin:function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}))
app.set('trust proxy', 1);
app.use(cookieParser())



app.use(express.json())
app.use('/', clientRoutes);
app.use('/', adminRoutes);
app.use('/', clientRoutesNew);

let serverStarted=false
export const startServer = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started listening on port ${process.env.PORT}`);
    serverStarted=true
  });
};

export const checkIsServerStarted = ():boolean =>{
  return serverStarted
}
