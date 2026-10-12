import 'dotenv/config'; 
import mongoose from 'mongoose';
import app from './app.js'; 
import { connectDatabase } from './config/db.js';
const port = Number(process.env.PORT) || 8000;
try 
{ 
    await connectDatabase(); 
    const server = app.listen(port, () => console.log(`Smart Irrigation API listening on port ${port}`)); 
    const shutdown = async () => { 
        await mongoose.connection.close(); server.close(() => process.exit(0)); 
    }; 
    process.on('SIGINT', shutdown); 
    process.on('SIGTERM', shutdown); 
} catch (error) 
{ 
    console.error('Startup failed', { name: error.name, code: error.code, message: error.message });
    process.exit(1);
}
