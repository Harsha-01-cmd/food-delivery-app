const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sinhaharsha2805:sattuji05@foodapp.p1xyl.mongodb.net/foodapp';

async function connectToMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        // Access collections
        const foodCollection = mongoose.connection.db.collection("food_items");
        const categoryCollection = mongoose.connection.db.collection("Categories");

        // Fetch data from collections
        const foodData = await foodCollection.find({}).toArray();
        const categoryData = await categoryCollection.find({}).toArray();

        // Execute callback with fetched data
        return { foodData, categoryData };

    } catch (err) {
        console.error("---" + err);
        throw err;
    }
}

module.exports = connectToMongoDB;
