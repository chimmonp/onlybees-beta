const mongoose = require('mongoose');

const restaurantSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
});

export default mongoose.models.RestaurantSection || mongoose.model('RestaurantSection', restaurantSectionSchema);
