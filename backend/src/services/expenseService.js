const expenseRepository = require('../repositories/expenseRepository');
const Vehicle = require('../models/Vehicle');
const VehicleTimeline = require('../models/VehicleTimeline');
const notificationService = require('./notificationService');
const ApiError = require('../utils/apiError');

class ExpenseService {
  /**
   * Add a new expense.
   */
  async createExpense(expenseData, userId) {
    const { vehicle: vehicleId, expenseType, amount } = expenseData;

    // Validate vehicle
    const vehicleObj = await Vehicle.findOne({ _id: vehicleId, isDeleted: false });
    if (!vehicleObj) {
      throw new ApiError('Vehicle not found', 404);
    }

    expenseData.createdBy = userId;
    expenseData.updatedBy = userId;

    const savedExpense = await expenseRepository.create(expenseData);

    // Log vehicle timeline event
    const log = new VehicleTimeline({
      vehicleId,
      eventType: 'Expense Added',
      description: `Added expense category '${expenseType}' of $${amount}. Vendor: ${expenseData.vendor || 'Not specified'}.`,
      createdBy: userId
    });
    await log.save();

    await notificationService.createNotification(userId, 'Expense Added', 'Expense Added', `Added expense category ${expenseType} of $${amount} to vehicle ${vehicleObj.registrationNumber}.`);

    return savedExpense;
  }

  /**
   * Get all expenses (paginated, sorted, filtered).
   */
  async getExpenses(queryParams) {
    const { results, page, limit, totalPages, totalResults } = await expenseRepository.findAll(queryParams);
    return {
      expenses: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Get single expense details.
   */
  async getExpenseDetails(id) {
    const expense = await expenseRepository.findById(id);
    if (!expense) {
      throw new ApiError('Expense not found', 404);
    }
    return expense;
  }

  /**
   * Update expense attributes.
   */
  async updateExpense(id, updateData, userId) {
    const expense = await expenseRepository.findById(id);
    if (!expense) {
      throw new ApiError('Expense not found', 404);
    }

    const forbidden = ['_id', 'createdAt', 'createdBy', 'isDeleted', 'deletedAt', 'deletedBy'];
    forbidden.forEach(k => delete updateData[k]);

    updateData.updatedBy = userId;
    return await expenseRepository.update(id, updateData);
  }

  /**
   * Soft delete expense.
   */
  async deleteExpense(id, userId) {
    const expense = await expenseRepository.findById(id);
    if (!expense) {
      throw new ApiError('Expense not found', 404);
    }
    await expenseRepository.softDelete(id, userId);
    return true;
  }

  /**
   * Get overall expense statistics.
   */
  async getExpenseStatistics() {
    return await expenseRepository.getStats();
  }

  /**
   * Get expenses related to a vehicle.
   */
  async getExpensesByVehicle(vehicleId) {
    return await expenseRepository.findByVehicle(vehicleId);
  }
}

module.exports = new ExpenseService();
