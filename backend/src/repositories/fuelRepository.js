const FuelLog = require('../models/FuelLog');
const { applyQueryOptions } = require('../utils/queryHelper');

class FuelRepository {
  /**
   * Create a new fuel log.
   */
  async create(data) {
    if (!data.fuelLogNumber) {
      const count = await FuelLog.countDocuments();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      data.fuelLogNumber = `FUEL-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    }
    const log = new FuelLog(data);
    return await log.save();
  }

  /**
   * Find fuel log by ID.
   */
  async findById(id) {
    return await FuelLog.findOne({ _id: id, isDeleted: false })
      .populate('vehicle')
      .populate('driver')
      .populate('trip')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Find previous fuel log for a vehicle to calculate odometer-based efficiency.
   */
  async findLatestBeforeDate(vehicleId, dateStr) {
    return await FuelLog.findOne({
      vehicle: vehicleId,
      fuelDate: { $lt: new Date(dateStr) },
      isDeleted: false
    })
      .sort({ fuelDate: -1 })
      .exec();
  }

  /**
   * Find all fuel logs (paginated, sorted, filtered).
   */
  async findAll(queryParams) {
    const searchableFields = ['fuelLogNumber', 'fuelType', 'fuelStation', 'invoiceNumber', 'paymentMethod'];
    const queryParamsWithFilter = {
      ...queryParams,
      isDeleted: false
    };

    return await applyQueryOptions(
      FuelLog,
      queryParamsWithFilter,
      searchableFields,
      ['vehicle', 'driver', 'trip']
    );
  }

  /**
   * Update fuel log.
   */
  async update(id, data) {
    return await FuelLog.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    )
      .populate('vehicle')
      .populate('driver')
      .populate('trip')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Soft delete fuel log.
   */
  async softDelete(id, userId) {
    return await FuelLog.findOneAndUpdate(
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
   * Get fuel logs stats.
   */
  async getStats() {
    const results = await FuelLog.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalLiters: { $sum: '$quantity' },
          totalCost: { $sum: '$totalCost' },
          averagePrice: { $avg: '$pricePerUnit' },
          logCount: { $sum: 1 }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalLiters: 0,
        totalCost: 0,
        averagePrice: 0,
        logCount: 0
      };
    }

    const stats = results[0];
    delete stats._id;
    stats.totalLiters = parseFloat(stats.totalLiters.toFixed(2));
    stats.totalCost = parseFloat(stats.totalCost.toFixed(2));
    stats.averagePrice = parseFloat(stats.averagePrice.toFixed(2));

    return stats;
  }

  /**
   * Get fuel logs for a specific vehicle.
   */
  async findByVehicle(vehicleId) {
    return await FuelLog.find({ vehicle: vehicleId, isDeleted: false })
      .populate('driver')
      .populate('trip')
      .sort({ fuelDate: -1 })
      .exec();
  }
}

module.exports = new FuelRepository();
