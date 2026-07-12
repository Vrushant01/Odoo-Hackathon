const Maintenance = require('../models/Maintenance');
const { applyQueryOptions } = require('../utils/queryHelper');

class MaintenanceRepository {
  /**
   * Create a new maintenance record. Auto-generates maintenanceNumber.
   */
  async create(data) {
    if (!data.maintenanceNumber) {
      const count = await Maintenance.countDocuments();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      data.maintenanceNumber = `MAIN-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    }
    const maintenance = new Maintenance(data);
    return await maintenance.save();
  }

  /**
   * Find maintenance by ID.
   */
  async findById(id) {
    return await Maintenance.findOne({ _id: id, isDeleted: false })
      .populate('vehicle')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Check if there's any active maintenance (Scheduled or In Progress) for a vehicle.
   */
  async findActiveByVehicle(vehicleId) {
    return await Maintenance.findOne({
      vehicle: vehicleId,
      status: { $in: ['Scheduled', 'In Progress'] },
      isDeleted: false
    }).exec();
  }

  /**
   * Find all maintenance records (paginated, sorted, filtered).
   */
  async findAll(queryParams) {
    const searchableFields = ['maintenanceNumber', 'maintenanceType', 'category', 'workshop', 'mechanic'];
    const queryParamsWithFilter = {
      ...queryParams,
      isDeleted: false
    };

    return await applyQueryOptions(
      Maintenance, 
      queryParamsWithFilter, 
      searchableFields, 
      ['vehicle']
    );
  }

  /**
   * Update maintenance.
   */
  async update(id, data) {
    return await Maintenance.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    )
      .populate('vehicle')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Soft delete maintenance.
   */
  async softDelete(id, userId) {
    return await Maintenance.findOneAndUpdate(
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
   * Get maintenance stats.
   */
  async getStats() {
    const today = new Date();
    const results = await Maintenance.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          scheduled: { $sum: { $cond: [{ $eq: ['$status', 'Scheduled'] }, 1, 0] } },
          active: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$status', 'Scheduled'] }, { $lt: ['$scheduledDate', today] }] },
                1,
                0
              ]
            }
          },
          averageCost: {
            $avg: { $cond: [{ $eq: ['$status', 'Completed'] }, '$finalCost', null] }
          },
          averageDowntime: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'Completed'] },
                    { $not: [{ $eq: ['$startedDate', null] }] },
                    { $not: [{ $eq: ['$completedDate', null] }] }
                  ]
                },
                { $divide: [{ $subtract: ['$completedDate', '$startedDate'] }, 1000 * 60 * 60] },
                null
              ]
            }
          }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalMaintenance: 0,
        scheduled: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        overdue: 0,
        averageCost: 0,
        averageDowntime: 0
      };
    }

    const stats = results[0];
    const data = {
      totalMaintenance: stats.total,
      scheduled: stats.scheduled,
      active: stats.active,
      completed: stats.completed,
      cancelled: stats.cancelled,
      overdue: stats.overdue,
      averageCost: stats.averageCost ? parseFloat(stats.averageCost.toFixed(2)) : 0,
      averageDowntime: stats.averageDowntime ? parseFloat(stats.averageDowntime.toFixed(2)) : 0
    };

    return data;
  }

  /**
   * Get upcoming maintenance (scheduled, scheduledDate >= today).
   */
  async getUpcoming() {
    const today = new Date();
    return await Maintenance.find({
      status: 'Scheduled',
      scheduledDate: { $gte: today },
      isDeleted: false
    })
      .populate('vehicle')
      .sort({ scheduledDate: 1 })
      .exec();
  }

  /**
   * Get overdue maintenance (scheduled, scheduledDate < today).
   */
  async getOverdue() {
    const today = new Date();
    return await Maintenance.find({
      status: 'Scheduled',
      scheduledDate: { $lt: today },
      isDeleted: false
    })
      .populate('vehicle')
      .sort({ scheduledDate: 1 })
      .exec();
  }
}

module.exports = new MaintenanceRepository();
