const Driver = require('../models/Driver');
const DriverTimeline = require('../models/DriverTimeline');
const { applyQueryOptions } = require('../utils/queryHelper');

class DriverRepository {
  /**
   * Create a new driver record.
   */
  async create(data) {
    const driver = new Driver(data);
    return await driver.save();
  }

  /**
   * Find driver by ID, excluding soft deleted ones.
   */
  async findById(id) {
    return await Driver.findOne({ _id: id, isDeleted: false })
      .populate('assignedVehicle')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Find driver by email.
   */
  async findByEmail(email) {
    return await Driver.findOne({
      email: email.toLowerCase(),
      isDeleted: false
    }).exec();
  }

  /**
   * Find driver by license number (for uniqueness checks).
   */
  async findByLicense(licenseNumber) {
    return await Driver.findOne({
      licenseNumber: licenseNumber.toUpperCase(),
      isDeleted: false
    }).exec();
  }

  /**
   * Find all drivers using paginated query helper.
   * Excludes soft-deleted records.
   */
  async findAll(queryParams) {
    const searchableFields = ['fullName', 'licenseNumber', 'phoneNumber', 'email'];
    
    // Inject soft delete filter
    const queryParamsWithFilter = {
      ...queryParams,
      isDeleted: false
    };

    return await applyQueryOptions(Driver, queryParamsWithFilter, searchableFields, ['assignedVehicle']);
  }

  /**
   * Update driver.
   */
  async update(id, data) {
    return await Driver.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    )
      .populate('assignedVehicle')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Soft delete a driver.
   */
  async softDelete(id, userId) {
    return await Driver.findOneAndUpdate(
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
   * Fetch driver statistics.
   */
  async getStats() {
    const results = await Driver.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalDrivers: { $sum: 1 },
          availableDrivers: { $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] } },
          driversOnTrip: { $sum: { $cond: [{ $eq: ['$status', 'On Trip'] }, 1, 0] } },
          suspendedDrivers: { $sum: { $cond: [{ $eq: ['$status', 'Suspended'] }, 1, 0] } },
          expiredLicenses: { $sum: { $cond: [{ $eq: ['$status', 'License Expired'] }, 1, 0] } },
          averageSafetyScore: { $avg: '$safetyScore' }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalDrivers: 0,
        availableDrivers: 0,
        driversOnTrip: 0,
        suspendedDrivers: 0,
        expiredLicenses: 0,
        averageSafetyScore: 100
      };
    }

    const stats = results[0];
    delete stats._id;
    
    stats.averageSafetyScore = stats.averageSafetyScore 
      ? parseFloat(stats.averageSafetyScore.toFixed(2))
      : 100;

    return stats;
  }

  /**
   * Create a timeline event log.
   */
  async createTimeline(timelineData) {
    const log = new DriverTimeline(timelineData);
    return await log.save();
  }

  /**
   * Get timeline history for a driver.
   */
  async getTimeline(driverId) {
    return await DriverTimeline.find({ driverId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName email')
      .exec();
  }

  /**
   * Scans for expired licenses and sets status to 'License Expired'.
   */
  async checkExpiredLicenses() {
    const today = new Date();
    
    const expiredDrivers = await Driver.find({
      isDeleted: false,
      status: { $ne: 'License Expired' },
      licenseExpiryDate: { $lt: today }
    });

    for (const driver of expiredDrivers) {
      driver.status = 'License Expired';
      await driver.save();

      await this.createTimeline({
        driverId: driver.id,
        eventType: 'Suspended', // Classify under suspended action
        description: `Driver license (${driver.licenseNumber}) expired on ${driver.licenseExpiryDate.toDateString()}. Status set to 'License Expired'.`,
        createdBy: driver.createdBy // Set to original creator
      });
    }
  }
}

module.exports = new DriverRepository();
