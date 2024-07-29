import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import clientRoutes from './routes/clientRoutes';
require('dotenv').config();
import mongoose from 'mongoose';

export const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  origin: "*",
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use('/', clientRoutes);

let serverStarted=false
export const startServer = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started listening on port ${process.env.PORT}`);
    serverStarted=true
  });
};

const connectDBwithRetry = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connected successfully');
    if (!serverStarted) {
      startServer();
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    setTimeout(connectDBwithRetry, 5000); // Retry connection after 5 seconds
  }
};

// Handling mongoose connection error
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Try to connect with db once it gets disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Lost MongoDB connection. Attempting to reconnect...');
  connectDBwithRetry();
});

// Start the initial connection
connectDBwithRetry();

export const checkIsServerStarted = ():boolean =>{
  return serverStarted
}

export default (req:Request, res:Response) => {
  app(req, res);
};