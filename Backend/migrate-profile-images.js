const mongoose = require('mongoose');
const Users = require('./models/Users');
require('dotenv').config();

async function migrateProfileImages() {
    try {
        await mongoose.connect(process.env.MONGO_LINK);
        console.log('Connected to MongoDB');

        const result = await Users.updateMany(
            { profile_image: { $exists: false } },
            { $set: { profile_image: 'https://via.placeholder.com/150/cccccc/000000?text=User' } }
        );

        console.log(`Updated ${result.modifiedCount} user documents with default profile image`);
        
        await mongoose.disconnect();
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateProfileImages();