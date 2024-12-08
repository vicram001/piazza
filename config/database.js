/**
 * Establish a connection to the MongoDB database.
 * The connection string is retrieved from the environment variable MURL.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MURL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit the process with a failure code if the connection fails
    }
};

module.exports = connectDB;