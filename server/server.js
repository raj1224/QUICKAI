import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { clerkMiddleware ,requireAuth} from '@clerk/express'
import userRouter from './routes/userRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';



const app = express();



await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())


app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use(requireAuth()); //routes created after this needs to be login first

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});