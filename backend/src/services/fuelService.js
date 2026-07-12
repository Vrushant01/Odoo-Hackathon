const fuelRepository = require('../repositories/fuelRepository');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const VehicleTimeline = require('../models/VehicleTimeline');
const notificationService = require('./notificationService');
const ApiError = require('../utils/apiError');

class FuelService {
  /**
   * Add a new fuel purchase log.
   */
  async createFuelLog(fuelData, userId) {
    const { vehicle: vehicleId, quantity, pricePerUnit, fuelDate = new Date() } = fuelData;

    // Validate vehicle
    const vehicleObj = await Vehicle.findOne({ _id: vehicleId, isDeleted: false });
    if (!vehicleObj) {
      throw new ApiError('Vehicle not found', 404);
    }

    // Auto-calculate Total Cost
    const totalCost = quantity * pricePerUnit;
    fuelData.totalCost = parseFloat(totalCost.toFixed(2));
    fuelData.createdBy = userId;
    fuelData.updatedBy = userId;

    // Calculate Fuel Efficiency
    let fuelEfficiency = 0;
    if (fuelData.trip) {
      const tripObj = await Trip.findById(fuelData.trip);
      if (tripObj) {
        const distance = tripObj.actualDistance || tripObj.plannedDistance || 0;
        if (distance > 0 && quantity > 0) {
          fuelEfficiency = distance / quantity;
        }
      }
    } else if (fuelData.currentOdometer) {
      const previousLog = await fuelRepository.findLatestBeforeDate(vehicleId, fuelDate);
      if (previousLog && previousLog.currentOdometer && fuelData.currentOdometer > previousLog.currentOdometer) {
        const distance = fuelData.currentOdometer - previousLog.currentOdometer;
        fuelEfficiency = distance / quantity;
      }
    }

    const savedLog = await fuelRepository.create(fuelData);

    // Log vehicle timeline event
    const efficiencyStr = fuelEfficiency > 0 ? ` Efficiency: ${fuelEfficiency.toFixed(2)} km/L.` : '';
    const log = new VehicleTimeline({
      vehicleId,
      eventType: 'Fuel Added',
      description: `Added ${quantity} liters of fuel at $${pricePerUnit}/L (Total cost: $${fuelData.totalCost}).${efficiencyStr}`,
      createdBy: userId
    });
    await log.save();

    await notificationService.createNotification(userId, 'Fuel Added', 'Fuel Added', `Added ${quantity}L fuel to vehicle ${vehicleObj.registrationNumber}.`);

    return savedLog;
  }

  /**
   * Get all fuel logs.
   */
  async getFuelLogs(queryParams) {
    const { results, page, limit, totalPages, totalResults } = await fuelRepository.findAll(queryParams);
    return {
      fuelLogs: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Get fuel log details.
   */
  async getFuelDetails(id) {
    const log = await fuelRepository.findById(id);
    if (!log) {
      throw new ApiError('Fuel log not found', 404);
    }
    return log;
  }

  /**
   * Update fuel log.
   */
  async updateFuelLog(id, updateData, userId) {
    const log = await fuelRepository.findById(id);
    if (!log) {
      throw new ApiError('Fuel log not found', 404);
    }

    const forbidden = ['_id', 'createdAt', 'createdBy', 'isDeleted', 'deletedAt', 'deletedBy'];
    forbidden.forEach(k => delete updateData[k]);

    // Recompute total cost if quantity or price changes
    const quantity = updateData.quantity || log.quantity;
    const pricePerUnit = updateData.pricePerUnit || log.pricePerUnit;
    updateData.totalCost = parseFloat((quantity * pricePerUnit).toFixed(2));

    updateData.updatedBy = userId;
    return await fuelRepository.update(id, updateData);
  }

  /**
   * Soft delete fuel log.
   */
  async deleteFuelLog(id, userId) {
    const log = await fuelRepository.findById(id);
    if (!log) {
      throw new ApiError('Fuel log not found', 404);
    }
    await fuelRepository.softDelete(id, userId);
    return true;
  }

  /**
   * Get fuel statistics.
   */
  async getFuelStatistics() {
    return await fuelRepository.getStats();
  }

  /**
   * Get fuel logs for a vehicle.
   */
  async getFuelLogsByVehicle(vehicleId) {
    return await fuelRepository.findByVehicle(vehicleId);
  }
}

module.exports = new FuelService();
