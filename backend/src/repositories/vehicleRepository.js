const Vehicle = require('../models/Vehicle');
const VehicleTimeline = require('../models/VehicleTimeline');
const { applyQueryOptions } = require('../utils/queryHelper');

class VehicleRepository {
  /**
   * Create a new vehicle.
   */
  async create(data) {
    const vehicle = new Vehicle(data);
    return await vehicle.save();
  }

  /**
   * Find vehicle by ID, excluding soft deleted ones.
   */
  async findById(id) {
    return await Vehicle.findOne({ _id: id, isDeleted: false })
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Find vehicle by registration number (for uniqueness checks).
   */
  async findByRegNumber(regNumber) {
    return await Vehicle.findOne({
      registrationNumber: regNumber.toUpperCase(),
      isDeleted: false
    }).exec();
  }

  /**
   * Find all vehicles using paginated query helper.
   * Excludes soft-deleted records.
   */
  async findAll(queryParams) {
    const searchableFields = ['registrationNumber', 'vehicleName', 'vehicleModel', 'manufacturer'];
    
    // Inject soft delete filter
    const queryParamsWithFilter = {
      ...queryParams,
      isDeleted: false
    };

    return await applyQueryOptions(Vehicle, queryParamsWithFilter, searchableFields);
  }

  /**
   * Update a vehicle.
   */
  async update(id, data) {
    return await Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    )
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Soft delete a vehicle.
   */
  async softDelete(id, userId) {
    return await Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId
      },
      { new: true }
    ).exec();
  }

  /**
   * Fetch fleet statistics.
   */
  async getStats() {
    const results = await Vehicle.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] } },
          onTrip: { $sum: { $cond: [{ $eq: ['$status', 'On Trip'] }, 1, 0] } },
          inShop: { $sum: { $cond: [{ $eq: ['$status', 'In Shop'] }, 1, 0] } },
          retired: { $sum: { $cond: [{ $eq: ['$status', 'Retired'] }, 1, 0] } }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalVehicles: 0,
        available: 0,
        onTrip: 0,
        inShop: 0,
        retired: 0,
        fleetUtilization: 0
      };
    }

    const stats = results[0];
    delete stats._id;
    
    // Utilization Rate = (On Trip / Total Vehicles) * 100
    stats.fleetUtilization = stats.totalVehicles > 0 
      ? parseFloat(((stats.onTrip / stats.totalVehicles) * 100).toFixed(2))
      : 0;

    return stats;
  }

  /**
   * Create a timeline event log.
   */
  async createTimeline(timelineData) {
    const log = new VehicleTimeline(timelineData);
    return await log.save();
  }

  /**
   * Get timeline history for a vehicle.
   */
  async getTimeline(vehicleId) {
    return await VehicleTimeline.find({ vehicleId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName email')
      .exec();
  }
}

module.exports = new VehicleRepository();
