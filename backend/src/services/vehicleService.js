const vehicleRepository = require('../repositories/vehicleRepository');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const VehicleTimeline = require('../models/VehicleTimeline');
const ApiError = require('../utils/apiError');

class VehicleService {
  /**
   * Register a new vehicle.
   */
  async registerVehicle(vehicleData, userId) {
    const { registrationNumber } = vehicleData;

    // Validate registration uniqueness
    const existing = await vehicleRepository.findByRegNumber(registrationNumber);
    if (existing) {
      throw new ApiError(`Vehicle with registration number '${registrationNumber}' already exists`, 400);
    }

    // Set audit logs
    const dataToSave = {
      ...vehicleData,
      createdBy: userId,
      updatedBy: userId
    };

    const vehicle = await vehicleRepository.create(dataToSave);

    // Log timeline event
    await vehicleRepository.createTimeline({
      vehicleId: vehicle.id,
      eventType: 'Vehicle Registered',
      description: `Vehicle registered with plate number '${vehicle.registrationNumber}'.`,
      createdBy: userId
    });

    return vehicle;
  }

  /**
   * Get all vehicles (paginated, sorted, filtered).
   */
  async getVehicles(queryParams) {
    const { results, page, limit, totalPages, totalResults } = await vehicleRepository.findAll(queryParams);
    
    return {
      vehicles: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Get detailed information for a single vehicle including summaries, timelines, and ROI.
   */
  async getVehicleDetails(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    // Fetch related records from stubs/databases
    const [trips, maintenance, fuelLogs, expenses, timeline] = await Promise.all([
      Trip.find({ vehicleId: id }),
      Maintenance.find({ vehicleId: id }),
      FuelLog.find({ vehicleId: id }),
      Expense.find({ vehicleId: id }),
      VehicleTimeline.find({ vehicleId: id }).sort({ createdAt: -1 }).limit(10).populate('createdBy', 'fullName')
    ]);

    // Compute Summaries
    const completedTrips = trips.filter(t => t.status === 'Completed');
    const totalTrips = trips.length;
    const completedTripsCount = completedTrips.length;

    const totalFuelLiters = fuelLogs.reduce((acc, curr) => acc + curr.liters, 0);
    const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.cost, 0);

    const totalMaintenanceCost = maintenance.reduce((acc, curr) => acc + curr.cost, 0);
    const openMaintenanceLogs = maintenance.filter(m => m.status === 'Open').length;

    const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Compute Estimated ROI
    // Estimated Revenue = (finalDistance * 3.0) + (cargoWeight * 0.02)
    const estimatedRevenue = completedTrips.reduce((acc, trip) => {
      const distance = trip.finalDistance || trip.plannedDistance || 0;
      const weight = trip.cargoWeight || 0;
      return acc + (distance * 3.0) + (weight * 0.02);
    }, 0);

    const totalCost = totalFuelCost + totalMaintenanceCost + totalExpenseAmount;
    const netProfit = estimatedRevenue - totalCost;
    const roiPercentage = totalCost > 0 ? parseFloat(((netProfit / totalCost) * 100).toFixed(2)) : (estimatedRevenue > 0 ? 100.0 : 0.0);

    return {
      vehicle,
      summaries: {
        trips: {
          total: totalTrips,
          completed: completedTripsCount
        },
        fuel: {
          totalLiters: round(totalFuelLiters, 2),
          totalCost: round(totalFuelCost, 2)
        },
        maintenance: {
          totalCost: round(totalMaintenanceCost, 2),
          openLogs: openMaintenanceLogs
        },
        expense: {
          totalAmount: round(totalExpenseAmount, 2)
        },
        roi: {
          estimatedRevenue: round(estimatedRevenue, 2),
          totalCost: round(totalCost, 2),
          netProfit: round(netProfit, 2),
          roiPercentage
        }
      },
      timeline
    };
  }

  /**
   * Update vehicle information.
   */
  async updateVehicle(id, updateData, userId) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    // Clean data: remove forbidden fields
    const forbidden = ['_id', 'createdAt', 'createdBy', 'isDeleted', 'deletedAt', 'deletedBy'];
    forbidden.forEach(k => delete updateData[k]);

    // Handle duplicate registration number checks if it is being modified
    if (updateData.registrationNumber && updateData.registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
      const existing = await vehicleRepository.findByRegNumber(updateData.registrationNumber);
      if (existing) {
        throw new ApiError(`Vehicle with registration number '${updateData.registrationNumber}' already exists`, 400);
      }
      updateData.registrationNumber = updateData.registrationNumber.toUpperCase();
    }

    updateData.updatedBy = userId;

    const updatedVehicle = await vehicleRepository.update(id, updateData);

    // Log timeline event
    await vehicleRepository.createTimeline({
      vehicleId: id,
      eventType: 'Vehicle Updated',
      description: 'Vehicle configuration details updated.',
      createdBy: userId
    });

    return updatedVehicle;
  }

  /**
   * Soft delete a vehicle.
   */
  async deleteVehicle(id, userId) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    await vehicleRepository.softDelete(id, userId);
    return true;
  }

  /**
   * Retire a vehicle.
   */
  async retireVehicle(id, userId) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    if (vehicle.status === 'Retired') {
      throw new ApiError('Vehicle is already retired', 400);
    }

    const updatedVehicle = await vehicleRepository.update(id, {
      status: 'Retired',
      updatedBy: userId
    });

    // Log timeline event
    await vehicleRepository.createTimeline({
      vehicleId: id,
      eventType: 'Vehicle Retired',
      description: 'Vehicle marked as retired from active fleet operations.',
      createdBy: userId
    });

    return updatedVehicle;
  }

  /**
   * Get vehicle history (trips, maintenance, fuel logs, expenses, timeline).
   */
  async getVehicleHistory(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    const [trips, maintenance, fuelLogs, expenses, timeline] = await Promise.all([
      Trip.find({ vehicleId: id }).sort({ createdAt: -1 }),
      Maintenance.find({ vehicleId: id }).sort({ createdAt: -1 }),
      FuelLog.find({ vehicleId: id }).sort({ createdAt: -1 }),
      Expense.find({ vehicleId: id }).sort({ createdAt: -1 }),
      VehicleTimeline.find({ vehicleId: id }).sort({ createdAt: -1 }).populate('createdBy', 'fullName')
    ]);

    return {
      trips,
      maintenance,
      fuelLogs,
      expenses,
      timeline
    };
  }

  /**
   * Get overall vehicle fleet statistics.
   */
  async getVehicleStatistics() {
    return await vehicleRepository.getStats();
  }
}

// Float helper
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

module.exports = new VehicleService();
