const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantSection',
    required: true
  },
  capacity: {
    type: Number,
    default: 4  // Default capacity if not specified
  }
});

export default mongoose.models.Table || mongoose.model('Table', tableSchema);
