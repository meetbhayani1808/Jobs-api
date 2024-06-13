require('dotenv').config();
const mockData = require('./mock-data.json');
const Job = require('./models/Job');
const connectDB = require('./db/connect');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        for (let i = 0; i < 75; i++) {
            mockData[i].createdBy = '665de2eee06854cf58eb6acf';
        }        
        await Job.create(mockData);
        console.log('Success !!!');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();
