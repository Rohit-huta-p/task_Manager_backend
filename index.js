const express = require('express')
const app = express();
// cors
const cors = require('cors');
app.use(cors( 
    {
        origin: 'https://task-manager-ass.vercel.app/',
        credentials: true,
    }
        ));


// parse body to JSON
app.use(express.json());

// dotenv
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI
// Database
const { mongoose } = require('mongoose');

const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')

app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)




app.listen(PORT, async() => {
    try {
        console.log(`Server Started at...${PORT}`);
        await mongoose.connect(MONGO_URI);
        console.log("Database Connected");
        
    } catch (error) {
        console.log(error);
        
    }
    
})