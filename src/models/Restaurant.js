const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
