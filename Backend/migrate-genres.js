const mongoose = require('mongoose');
const Series = require('./models/Series');
const Movies = require('./models/Movies');
require('dotenv').config();

async function migrateGenres() {
    try {
        await mongoose.connect(process.env.MONGO_LINK);
        console.log('Connected to database');

        // Update Series without genres field
        const seriesResult = await Series.updateMany(
            { genres: { $exists: false } },
            { $set: { genres: [] } }
        );
        console.log(`Updated ${seriesResult.modifiedCount} series documents`);

        // Update Movies without genres field
        const moviesResult = await Movies.updateMany(
            { genres: { $exists: false } },
            { $set: { genres: [] } }
        );
        console.log(`Updated ${moviesResult.modifiedCount} movies documents`);

        console.log('Migration completed successfully');
       
    } catch (error) {
        console.error('Migration failed:', error);
        
    }
}

migrateGenres();