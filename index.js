import app from "./app.js"
import { config } from 'dotenv';
import connectionToDB from './config/dbConnection.js';

config();
const PORT = process.env.PORT || 5463
app.listen(PORT, async () => {
    await connectionToDB()
    console.log(`Book Recommendation Server running at port ${PORT}`)
})