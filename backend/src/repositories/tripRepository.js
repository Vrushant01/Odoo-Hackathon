const Trip = require('../models/Trip');
const TripTimeline = require('../models/TripTimeline');
const { applyQueryOptions } = require('../utils/queryHelper');

class TripRepository {
  /**
   * Create a new trip. Generates unique tripNumber if not supplied.
   */
  async create(data) {
    if (!data.tripNumber) {
      const count = await Trip.countDocuments();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      data.tripNumber = `TRIP-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    }
    const trip = new Trip(data);
    return await trip.save();
  }

  /**
   * Find trip by ID, excluding soft deleted ones.
   */
  async findById(id) {
    return await Trip.findOne({ _id: id, isDeleted: false })
      .populate('vehicle')
      .populate('driver')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Find all trips using paginated query helper.
   * Excludes soft-deleted records.
   */
  async findAll(queryParams) {
    const searchableFields = ['tripNumber', 'source', 'destination', 'cargoDescription'];
    
    // Inject soft delete filter
    const queryParamsWithFilter = {
      ...queryParams,
      isDeleted: false
    };

    return await applyQueryOptions(
      Trip, 
      queryParamsWithFilter, 
      searchableFields, 
      ['vehicle', 'driver']
    );
  }

  /**
   * Update trip details.
   */
  async update(id, data) {
    return await Trip.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    )
      .populate('vehicle')
      .populate('driver')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Soft delete a trip.
   */
  async softDelete(id, userId) {
    return await Trip.findOneAndUpdate(
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
   * Fetch trip dashboard and report statistics.
   */
  async getStats() {
    const results = await Trip.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          draftTrips: { $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] } },
          dispatchedTrips: { $sum: { $cond: [{ $eq: ['$status', 'Dispatched'] }, 1, 0] } },
          completedTrips: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          cancelledTrips: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
          averageDistance: {
            $avg: { $cond: [{ $eq: ['$status', 'Completed'] }, '$actualDistance', null] }
          },
          averageDuration: {
            $avg: { $cond: [{ $eq: ['$status', 'Completed'] }, '$actualDuration', null] }
          },
          averageCargo: { $avg: '$cargoWeight' },
          averageFuelEfficiency: {
            $avg: {
              $cond: [
                { $and: [{ $eq: ['$status', 'Completed'] }, { $gt: ['$fuelConsumed', 0] }] },
                { $divide: ['$actualDistance', '$fuelConsumed'] },
                null
              ]
            }
          }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalTrips: 0,
        draftTrips: 0,
        dispatchedTrips: 0,
        completedTrips: 0,
        cancelledTrips: 0,
        averageDistance: 0,
        averageDuration: 0,
        averageCargo: 0,
        averageFuelEfficiency: 0,
        completionRate: 0,
        cancellationRate: 0
      };
    }

    const stats = results[0];
    delete stats._id;

    const total = stats.totalTrips;
    stats.completionRate = total > 0 ? parseFloat(((stats.completedTrips / total) * 100).toFixed(2)) : 0;
    stats.cancellationRate = total > 0 ? parseFloat(((stats.cancelledTrips / total) * 100).toFixed(2)) : 0;

    stats.averageDistance = stats.averageDistance ? parseFloat(stats.averageDistance.toFixed(2)) : 0;
    stats.averageDuration = stats.averageDuration ? parseFloat(stats.averageDuration.toFixed(2)) : 0;
    stats.averageCargo = stats.averageCargo ? parseFloat(stats.averageCargo.toFixed(2)) : 0;
    stats.averageFuelEfficiency = stats.averageFuelEfficiency ? parseFloat(stats.averageFuelEfficiency.toFixed(2)) : 0;

    return stats;
  }

  /**
   * Create a trip timeline log.
   */
  async createTimeline(timelineData) {
    const log = new TripTimeline(timelineData);
    return await log.save();
  }

  /**
   * Get timeline history for a trip.
   */
  async getTimeline(tripId) {
    return await TripTimeline.find({ tripId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName email')
      .exec();
  }
}

module.exports = new TripRepository();
