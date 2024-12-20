import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { checkIsServerStarted, startServer } from '../server';

dotenv.config();

const connectDBwithRetry = async (): Promise<void> => {
    try {
      await mongoose.connect(process.env.MONGO_URI as string,{
        connectTimeoutMS:60000,
      });
      if (!checkIsServerStarted()) {
        startServer();
      }
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      setTimeout(connectDBwithRetry, 10000)
    }
  };

  //handling mongoose connection error
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  //try to connect with db once it gets disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('Lost MongoDB connection. Attempting to reconnect...');
    connectDBwithRetry();
  });

  connectDBwithRetry()

  export default connectDBwithRetry