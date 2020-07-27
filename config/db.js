const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`Connected to DB... ${connection.connection.host}`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
