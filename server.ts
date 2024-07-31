import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import adminRoutes from './routes/AdminRoutes';
import clientRoutes from './routes/clientRoutes';
require('dotenv').config();

export const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  origin: "https://it-augmentation-admin.vercel.app",
  // origin:'http://localhost:3000',
  credentials: true,
}))
app.set('trust proxy', 1);
app.use(cookieParser())

app.use(express.json())
app.use('/', clientRoutes);
app.use('/', adminRoutes);

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
