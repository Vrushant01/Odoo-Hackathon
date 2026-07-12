const Expense = require('../models/Expense');
const { applyQueryOptions } = require('../utils/queryHelper');

class ExpenseRepository {
  /**
   * Create a new expense.
   */
  async create(data) {
    if (!data.expenseNumber) {
      const count = await Expense.countDocuments();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      data.expenseNumber = `EXP-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    }
    const expense = new Expense(data);
    return await expense.save();
  }

  /**
   * Find expense by ID.
   */
  async findById(id) {
    return await Expense.findOne({ _id: id, isDeleted: false })
      .populate('vehicle')
      .populate('trip')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Find all expenses (paginated, sorted, filtered).
   */
  async findAll(queryParams) {
    const searchableFields = ['expenseNumber', 'expenseType', 'vendor', 'invoiceNumber', 'remarks'];
    const queryParamsWithFilter = {
      ...queryParams,
      isDeleted: false
    };

    return await applyQueryOptions(
      Expense,
      queryParamsWithFilter,
      searchableFields,
      ['vehicle', 'trip']
    );
  }

  /**
   * Update expense.
   */
  async update(id, data) {
    return await Expense.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    )
      .populate('vehicle')
      .populate('trip')
      .populate('updatedBy', 'fullName email')
      .exec();
  }

  /**
   * Soft delete expense.
   */
  async softDelete(id, userId) {
    return await Expense.findOneAndUpdate(
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
   * Get expense stats.
   */
  async getStats() {
    const results = await Expense.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          uniqueVehicles: { $addToSet: '$vehicle' },
          uniqueTrips: { $addToSet: '$trip' },
          expenseCount: { $sum: 1 }
        }
      },
      {
        $project: {
          totalExpenses: 1,
          expenseCount: 1,
          vehiclesCount: { $size: '$uniqueVehicles' },
          tripsCount: { $size: { $filter: { input: '$uniqueTrips', cond: { $ne: ['$$this', null] } } } }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalExpenses: 0,
        expensePerVehicle: 0,
        expensePerTrip: 0,
        expenseCount: 0
      };
    }

    const stats = results[0];
    delete stats._id;

    stats.expensePerVehicle = stats.vehiclesCount > 0 
      ? parseFloat((stats.totalExpenses / stats.vehiclesCount).toFixed(2)) 
      : 0;

    stats.expensePerTrip = stats.tripsCount > 0 
      ? parseFloat((stats.totalExpenses / stats.tripsCount).toFixed(2)) 
      : 0;

    stats.totalExpenses = parseFloat(stats.totalExpenses.toFixed(2));
    
    // Clean up fields from project
    delete stats.vehiclesCount;
    delete stats.tripsCount;

    return stats;
  }

  /**
   * Get expenses for a specific vehicle.
   */
  async findByVehicle(vehicleId) {
    return await Expense.find({ vehicle: vehicleId, isDeleted: false })
      .populate('trip')
      .sort({ expenseDate: -1 })
      .exec();
  }
}

module.exports = new ExpenseRepository();
