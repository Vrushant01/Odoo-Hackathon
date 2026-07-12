const tripRepository = require('../repositories/tripRepository');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const VehicleTimeline = require('../models/VehicleTimeline');
const DriverTimeline = require('../models/DriverTimeline');
const notificationService = require('./notificationService');
const ApiError = require('../utils/apiError');

class TripService {
  /**
   * Create a new trip (Draft status).
   */
  async createTrip(tripData, userId) {
    const { vehicle: vehicleId, driver: driverId, cargoWeight, plannedDistance } = tripData;

    // Fetch and validate Vehicle
    const vehicleObj = await Vehicle.findOne({ _id: vehicleId, isDeleted: false });
    if (!vehicleObj) {
      throw new ApiError('Vehicle not found', 404);
    }
    if (vehicleObj.status !== 'Available') {
      throw new ApiError(`Vehicle ${vehicleObj.registrationNumber} is not Available (Current status: ${vehicleObj.status})`, 400);
    }
    if (vehicleObj.status === 'Retired' || vehicleObj.status === 'In Shop') {
      throw new ApiError('Cannot assign a retired or shop-bound vehicle to a trip', 400);
    }

    // Fetch and validate Driver
    const driverObj = await Driver.findOne({ _id: driverId, isDeleted: false });
    if (!driverObj) {
      throw new ApiError('Driver not found', 404);
    }
    if (driverObj.status !== 'Available') {
      throw new ApiError(`Driver ${driverObj.fullName} is not Available (Current status: ${driverObj.status})`, 400);
    }
    if (driverObj.status === 'Suspended' || driverObj.status === 'License Expired') {
      throw new ApiError('Cannot assign a suspended driver or a driver with an expired license', 400);
    }
    
    // License date expiry check
    if (new Date(driverObj.licenseExpiryDate) < new Date()) {
      throw new ApiError(`Driver ${driverObj.fullName} driving license is expired`, 400);
    }

    // Capacity validation
    if (cargoWeight > vehicleObj.maximumLoadCapacity) {
      throw new ApiError(`Cargo weight (${cargoWeight} kg) exceeds vehicle maximum capacity (${vehicleObj.maximumLoadCapacity} kg)`, 400);
    }

    // Populate maximum load capacity
    tripData.maximumVehicleCapacity = vehicleObj.maximumLoadCapacity;
    tripData.createdBy = userId;
    tripData.updatedBy = userId;
    tripData.status = 'Draft';

    const trip = await tripRepository.create(tripData);

    // Write Trip timelines
    await tripRepository.createTimeline({
      tripId: trip.id,
      eventType: 'Trip Created',
      description: `Trip registered in Draft status. Planned distance: ${plannedDistance} km.`,
      createdBy: userId
    });

    await tripRepository.createTimeline({
      tripId: trip.id,
      eventType: 'Vehicle Assigned',
      description: `Vehicle ${vehicleObj.registrationNumber} assigned to trip.`,
      createdBy: userId
    });

    await tripRepository.createTimeline({
      tripId: trip.id,
      eventType: 'Driver Assigned',
      description: `Driver ${driverObj.fullName} assigned to trip.`,
      createdBy: userId
    });

    return trip;
  }

  /**
   * Get all trips (paginated, sorted, filtered).
   */
  async getTrips(queryParams) {
    const { results, page, limit, totalPages, totalResults } = await tripRepository.findAll(queryParams);
    return {
      trips: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Get trip details.
   */
  async getTripDetails(id) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }

    const timeline = await tripRepository.getTimeline(id);

    return {
      trip,
      timeline
    };
  }

  /**
   * Update trip parameters.
   */
  async updateTrip(id, updateData, userId) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }

    // Do NOT allow editing vehicle or driver after dispatch
    if (trip.status !== 'Draft') {
      if (
        (updateData.vehicle && updateData.vehicle.toString() !== trip.vehicle._id.toString()) ||
        (updateData.driver && updateData.driver.toString() !== trip.driver._id.toString())
      ) {
        throw new ApiError('Cannot edit vehicle or driver after the trip is dispatched', 400);
      }
    }

    // Clean forbidden fields
    const forbidden = ['_id', 'createdAt', 'createdBy', 'isDeleted', 'deletedAt', 'deletedBy'];
    forbidden.forEach(k => delete updateData[k]);

    updateData.updatedBy = userId;

    // Handle vehicle updates in draft status
    if (updateData.vehicle && updateData.vehicle.toString() !== trip.vehicle._id.toString()) {
      const vehicleObj = await Vehicle.findOne({ _id: updateData.vehicle, isDeleted: false });
      if (!vehicleObj) throw new ApiError('Vehicle not found', 404);
      if (vehicleObj.status !== 'Available') throw new ApiError('Selected vehicle is not Available', 400);
      if (updateData.cargoWeight && updateData.cargoWeight > vehicleObj.maximumLoadCapacity) {
        throw new ApiError('Cargo weight exceeds new vehicle load capacity', 400);
      }
      updateData.maximumVehicleCapacity = vehicleObj.maximumLoadCapacity;
      
      await tripRepository.createTimeline({
        tripId: id,
        eventType: 'Vehicle Assigned',
        description: `Vehicle changed to ${vehicleObj.registrationNumber}.`,
        createdBy: userId
      });
    }

    // Handle driver updates in draft status
    if (updateData.driver && updateData.driver.toString() !== trip.driver._id.toString()) {
      const driverObj = await Driver.findOne({ _id: updateData.driver, isDeleted: false });
      if (!driverObj) throw new ApiError('Driver not found', 404);
      if (driverObj.status !== 'Available') throw new ApiError('Selected driver is not Available', 400);
      if (new Date(driverObj.licenseExpiryDate) < new Date()) {
        throw new ApiError('Selected driver license is expired', 400);
      }
      
      await tripRepository.createTimeline({
        tripId: id,
        eventType: 'Driver Assigned',
        description: `Driver changed to ${driverObj.fullName}.`,
        createdBy: userId
      });
    }

    const updatedTrip = await tripRepository.update(id, updateData);

    await tripRepository.createTimeline({
      tripId: id,
      eventType: 'Trip Updated',
      description: 'Trip parameters modified.',
      createdBy: userId
    });

    return updatedTrip;
  }

  /**
   * Dispatch a trip.
   */
  async dispatchTrip(id, userId) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }

    if (trip.status !== 'Draft') {
      throw new ApiError(`Cannot dispatch a trip in '${trip.status}' status`, 400);
    }

    // Verify driver and vehicle statuses
    const vehicleObj = await Vehicle.findById(trip.vehicle._id);
    if (vehicleObj.status !== 'Available') {
      throw new ApiError('Assigned vehicle is no longer Available', 400);
    }

    const driverObj = await Driver.findById(trip.driver._id);
    if (driverObj.status !== 'Available') {
      throw new ApiError('Assigned driver is no longer Available', 400);
    }
    if (new Date(driverObj.licenseExpiryDate) < new Date()) {
      throw new ApiError('Assigned driver license has expired', 400);
    }

    // Update statuses across models
    vehicleObj.status = 'On Trip';
    await vehicleObj.save();

    driverObj.status = 'On Trip';
    await driverObj.save();

    const dispatchTime = new Date();
    const updatedTrip = await tripRepository.update(id, {
      status: 'Dispatched',
      dispatchDate: dispatchTime,
      updatedBy: userId
    });

    // Log Timelines
    await tripRepository.createTimeline({
      tripId: id,
      eventType: 'Trip Dispatched',
      description: `Trip dispatched. Vehicle and Driver status set to 'On Trip'.`,
      createdBy: userId
    });

    // Write timelines on vehicle and driver collections
    const logTimeline = async (model, id, type, desc) => {
      const TimelineModel = model === 'Vehicle' ? VehicleTimeline : DriverTimeline;
      const refField = model === 'Vehicle' ? 'vehicleId' : 'driverId';
      const eventLog = new TimelineModel({
        [refField]: id,
        eventType: type,
        description: desc,
        createdBy: userId
      });
      await eventLog.save();
    };

    await logTimeline('Vehicle', vehicleObj.id, 'Trip Assigned', `Dispatched on trip number ${trip.tripNumber}.`);
    await logTimeline('Driver', driverObj.id, 'Trip Started', `Started driving trip number ${trip.tripNumber}.`);

    await notificationService.createNotification(userId, 'Trip Assigned', 'Trip Assigned', `Trip ${updatedTrip.tripNumber} has been dispatched.`);

    return updatedTrip;
  }

  /**
   * Complete a trip.
   */
  async completeTrip(id, completionData, userId) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }

    if (trip.status !== 'Dispatched') {
      throw new ApiError(`Only dispatched trips can be completed (Current: ${trip.status})`, 400);
    }

    const {
      finalOdometer,
      fuelConsumed,
      actualDistance,
      completionNotes,
      completionDate = new Date(),
      fuelCost = 0,
      maintenanceCost = 0,
      tollCost = 0,
      otherExpenses = 0
    } = completionData;

    // Validate odometer updates
    const vehicleObj = await Vehicle.findById(trip.vehicle._id);
    if (finalOdometer < vehicleObj.currentOdometer) {
      throw new ApiError(`Final odometer (${finalOdometer}) cannot be less than current odometer (${vehicleObj.currentOdometer})`, 400);
    }

    // 1. Release Vehicle
    vehicleObj.status = 'Available';
    vehicleObj.currentOdometer = finalOdometer;
    await vehicleObj.save();

    // 2. Release Driver
    const driverObj = await Driver.findById(trip.driver._id);
    driverObj.status = 'Available';
    await driverObj.save();

    // 3. Compute Metrics
    const actualDuration = Math.max(
      0.1,
      parseFloat(((new Date(completionDate) - new Date(trip.dispatchDate)) / (1000 * 60 * 60)).toFixed(2))
    );
    const totalOperationalCost = fuelCost + maintenanceCost + tollCost + otherExpenses;

    const updatePayload = {
      status: 'Completed',
      completedDate: completionDate,
      actualDistance,
      actualDuration,
      fuelConsumed,
      fuelCost,
      maintenanceCost,
      tollCost,
      otherExpenses,
      totalOperationalCost,
      notes: completionNotes || trip.notes,
      updatedBy: userId
    };

    const updatedTrip = await tripRepository.update(id, updatePayload);

    // Log timelines
    await tripRepository.createTimeline({
      tripId: id,
      eventType: 'Trip Completed',
      description: `Trip completed. Mileage: ${actualDistance} km. Cost: $${totalOperationalCost}.`,
      createdBy: userId
    });

    const logTimeline = async (model, id, type, desc) => {
      const TimelineModel = model === 'Vehicle' ? VehicleTimeline : DriverTimeline;
      const refField = model === 'Vehicle' ? 'vehicleId' : 'driverId';
      const eventLog = new TimelineModel({
        [refField]: id,
        eventType: type,
        description: desc,
        createdBy: userId
      });
      await eventLog.save();
    };

    await logTimeline('Vehicle', vehicleObj.id, 'Trip Completed', `Completed trip number ${trip.tripNumber}. Odometer updated to ${finalOdometer}.`);
    await logTimeline('Driver', driverObj.id, 'Trip Completed', `Completed trip number ${trip.tripNumber}.`);

    await notificationService.createNotification(userId, 'Trip Completed', 'Trip Completed', `Trip ${updatedTrip.tripNumber} has been completed.`);

    return updatedTrip;
  }

  /**
   * Cancel a trip.
   */
  async cancelTrip(id, cancelData, userId) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }

    if (trip.status === 'Completed' || trip.status === 'Cancelled') {
      throw new ApiError(`Trip is already in ${trip.status} status`, 400);
    }

    const { reason, remarks } = cancelData;

    // Reset vehicle and driver statuses to Available if dispatched
    if (trip.status === 'Dispatched') {
      const vehicleObj = await Vehicle.findById(trip.vehicle._id);
      vehicleObj.status = 'Available';
      await vehicleObj.save();

      const driverObj = await Driver.findById(trip.driver._id);
      driverObj.status = 'Available';
      await driverObj.save();

      const logTimeline = async (model, id, type, desc) => {
        const TimelineModel = model === 'Vehicle' ? VehicleTimeline : DriverTimeline;
        const refField = model === 'Vehicle' ? 'vehicleId' : 'driverId';
        const eventLog = new TimelineModel({
          [refField]: id,
          eventType: type,
          description: desc,
          createdBy: userId
        });
        await eventLog.save();
      };

      await logTimeline('Vehicle', vehicleObj.id, 'Trip Completed', `Trip ${trip.tripNumber} cancelled. Status reverted to Available.`);
      await logTimeline('Driver', driverObj.id, 'Trip Completed', `Trip ${trip.tripNumber} cancelled. Status reverted to Available.`);
    }

    const cancellationNotes = `Reason: ${reason || 'Not specified'}. Remarks: ${remarks || 'None'}`;
    const updatedTrip = await tripRepository.update(id, {
      status: 'Cancelled',
      notes: cancellationNotes,
      updatedBy: userId
    });

    await tripRepository.createTimeline({
      tripId: id,
      eventType: 'Trip Cancelled',
      description: `Trip cancelled. Reason: ${reason || 'Not specified'}.`,
      createdBy: userId
    });

    return updatedTrip;
  }

  /**
   * Soft delete a trip.
   */
  async deleteTrip(id, userId) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }

    // Revert statuses if deleted while dispatched
    if (trip.status === 'Dispatched') {
      await Vehicle.findByIdAndUpdate(trip.vehicle._id, { status: 'Available' });
      await Driver.findByIdAndUpdate(trip.driver._id, { status: 'Available' });
    }

    await tripRepository.softDelete(id, userId);
    return true;
  }

  /**
   * Get trip timeline.
   */
  async getTripTimeline(id) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }
    return await tripRepository.getTimeline(id);
  }

  /**
   * Get overall trip statistics.
   */
  async getTripStatistics() {
    return await tripRepository.getStats();
  }
}

module.exports = new TripService();
