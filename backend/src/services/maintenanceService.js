const maintenanceRepository = require('../repositories/maintenanceRepository');
const Vehicle = require('../models/Vehicle');
const VehicleTimeline = require('../models/VehicleTimeline');
const notificationService = require('./notificationService');
const ApiError = require('../utils/apiError');

class MaintenanceService {
  /**
   * Schedule a new maintenance. Sets vehicle status to 'In Shop'.
   */
  async createMaintenance(maintenanceData, userId) {
    const { vehicle: vehicleId, category } = maintenanceData;

    // Validate vehicle exists
    const vehicleObj = await Vehicle.findOne({ _id: vehicleId, isDeleted: false });
    if (!vehicleObj) {
      throw new ApiError('Vehicle not found', 404);
    }

    // Check if vehicle has active/scheduled maintenance
    const existingActive = await maintenanceRepository.findActiveByVehicle(vehicleId);
    if (existingActive) {
      throw new ApiError(`Vehicle already has active/scheduled maintenance (${existingActive.maintenanceNumber})`, 400);
    }

    // Put vehicle In Shop
    vehicleObj.status = 'In Shop';
    await vehicleObj.save();

    maintenanceData.createdBy = userId;
    maintenanceData.updatedBy = userId;
    maintenanceData.status = 'Scheduled';

    const maintenance = await maintenanceRepository.create(maintenanceData);

    // Log vehicle timeline event
    const log = new VehicleTimeline({
      vehicleId,
      eventType: 'Maintenance Scheduled',
      description: `Maintenance scheduled for category: '${category}'. Vehicle status changed to 'In Shop'.`,
      createdBy: userId
    });
    await log.save();

    await notificationService.createNotification(userId, 'Vehicle Maintenance Due', 'Maintenance Scheduled', `Vehicle ${vehicleObj.registrationNumber} maintenance due soon.`);

    return maintenance;
  }

  /**
   * Get all maintenance logs.
   */
  async getMaintenanceList(queryParams) {
    const { results, page, limit, totalPages, totalResults } = await maintenanceRepository.findAll(queryParams);
    return {
      maintenance: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Get maintenance details.
   */
  async getMaintenanceDetails(id) {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) {
      throw new ApiError('Maintenance log not found', 404);
    }
    return maintenance;
  }

  /**
   * Update maintenance details.
   */
  async updateMaintenance(id, updateData, userId) {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) {
      throw new ApiError('Maintenance log not found', 404);
    }

    const forbidden = ['_id', 'createdAt', 'createdBy', 'isDeleted', 'deletedAt', 'deletedBy'];
    forbidden.forEach(k => delete updateData[k]);

    updateData.updatedBy = userId;
    return await maintenanceRepository.update(id, updateData);
  }

  /**
   * Start maintenance (transitions to In Progress).
   */
  async startMaintenance(id, userId) {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) {
      throw new ApiError('Maintenance log not found', 404);
    }

    if (maintenance.status !== 'Scheduled') {
      throw new ApiError(`Cannot start maintenance that is already ${maintenance.status}`, 400);
    }

    const updated = await maintenanceRepository.update(id, {
      status: 'In Progress',
      startedDate: new Date(),
      updatedBy: userId
    });

    const log = new VehicleTimeline({
      vehicleId: maintenance.vehicle._id,
      eventType: 'Maintenance Started',
      description: `Maintenance '${maintenance.maintenanceNumber}' started in workshop.`,
      createdBy: userId
    });
    await log.save();

    return updated;
  }

  /**
   * Complete maintenance (calculates cost, updates vehicle to Available).
   */
  async completeMaintenance(id, completionData, userId) {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) {
      throw new ApiError('Maintenance log not found', 404);
    }

    if (maintenance.status !== 'In Progress') {
      throw new ApiError('Only maintenance in progress can be completed', 400);
    }

    const {
      labourCost = 0,
      partsCost = 0,
      additionalCost = 0,
      partsUsed = [],
      serviceNotes = ''
    } = completionData;

    const finalCost = labourCost + partsCost + additionalCost;

    // Reset vehicle status if not retired
    const vehicleObj = await Vehicle.findById(maintenance.vehicle._id);
    if (vehicleObj && vehicleObj.status !== 'Retired') {
      vehicleObj.status = 'Available';
      await vehicleObj.save();
    }

    const updated = await maintenanceRepository.update(id, {
      status: 'Completed',
      completedDate: new Date(),
      labourCost,
      partsCost,
      additionalCost,
      finalCost,
      partsUsed,
      serviceNotes,
      updatedBy: userId
    });

    // Write vehicle timeline logs
    const log1 = new VehicleTimeline({
      vehicleId: maintenance.vehicle._id,
      eventType: 'Maintenance Completed',
      description: `Maintenance '${maintenance.maintenanceNumber}' completed. Total cost: $${finalCost}.`,
      createdBy: userId
    });
    await log1.save();

    const log2 = new VehicleTimeline({
      vehicleId: maintenance.vehicle._id,
      eventType: 'Vehicle Returned',
      description: `Vehicle returned to active service. Status set to 'Available'.`,
      createdBy: userId
    });
    await log2.save();

    await notificationService.createNotification(userId, 'Maintenance Completed', 'Maintenance Completed', `Maintenance '${maintenance.maintenanceNumber}' has been completed.`);
    await notificationService.createNotification(userId, 'Vehicle Returned', 'Vehicle Returned', `Vehicle ${vehicleObj ? vehicleObj.registrationNumber : 'vehicle'} returned to service.`);

    return updated;
  }

  /**
   * Cancel maintenance (resets vehicle to Available).
   */
  async cancelMaintenance(id, userId) {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) {
      throw new ApiError('Maintenance log not found', 404);
    }

    if (maintenance.status === 'Completed' || maintenance.status === 'Cancelled') {
      throw new ApiError(`Maintenance is already in '${maintenance.status}' status`, 400);
    }

    const vehicleObj = await Vehicle.findById(maintenance.vehicle._id);
    if (vehicleObj && vehicleObj.status !== 'Retired') {
      vehicleObj.status = 'Available';
      await vehicleObj.save();
    }

    const updated = await maintenanceRepository.update(id, {
      status: 'Cancelled',
      updatedBy: userId
    });

    const log = new VehicleTimeline({
      vehicleId: maintenance.vehicle._id,
      eventType: 'Vehicle Returned',
      description: `Maintenance '${maintenance.maintenanceNumber}' cancelled. Vehicle status set to 'Available'.`,
      createdBy: userId
    });
    await log.save();

    await notificationService.createNotification(userId, 'Vehicle Returned', 'Vehicle Returned', `Vehicle ${vehicleObj ? vehicleObj.registrationNumber : 'vehicle'} returned to service after maintenance cancellation.`);

    return updated;
  }

  /**
   * Soft delete maintenance log.
   */
  async deleteMaintenance(id, userId) {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) {
      throw new ApiError('Maintenance log not found', 404);
    }

    // Revert status if active
    if (['Scheduled', 'In Progress'].includes(maintenance.status)) {
      const vehicleObj = await Vehicle.findById(maintenance.vehicle._id);
      if (vehicleObj && vehicleObj.status !== 'Retired') {
        vehicleObj.status = 'Available';
        await vehicleObj.save();
      }
    }

    await maintenanceRepository.softDelete(id, userId);
    return true;
  }

  /**
   * Get upcoming logs.
   */
  async getUpcoming() {
    return await maintenanceRepository.getUpcoming();
  }

  /**
   * Get overdue logs.
   */
  async getOverdue() {
    return await maintenanceRepository.getOverdue();
  }

  /**
   * Get stats.
   */
  async getStatistics() {
    return await maintenanceRepository.getStats();
  }
}

module.exports = new MaintenanceService();
