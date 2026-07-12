const tripService = require('../services/tripService');
const Trip = require('../models/Trip');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Register/Create a new trip in Draft state.
 */
const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'CREATE',
      'Trips',
      null,
      trip.toObject ? trip.toObject() : trip,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Trip registered successfully.', trip, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips (paginated, sorted, filtered).
 */
const getTrips = async (req, res, next) => {
  try {
    const data = await tripService.getTrips(req.query);
    return ApiResponse.success(res, 'Trips fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single trip details and populate vehicle/driver details.
 */
const getTripDetails = async (req, res, next) => {
  try {
    const data = await tripService.getTripDetails(req.params.id);
    return ApiResponse.success(res, 'Trip details fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update trip parameters.
 */
const updateTrip = async (req, res, next) => {
  try {
    const original = await Trip.findById(req.params.id);
    const trip = await tripService.updateTrip(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'UPDATE',
      'Trips',
      original ? original.toObject() : null,
      trip.toObject ? trip.toObject() : trip,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Trip updated successfully.', trip);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a trip.
 */
const deleteTrip = async (req, res, next) => {
  try {
    const original = await Trip.findById(req.params.id);
    await tripService.deleteTrip(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'DELETE',
      'Trips',
      original ? original.toObject() : null,
      null,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Trip deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Dispatch a trip (marks trip, vehicle, and driver as 'On Trip').
 */
const dispatchTrip = async (req, res, next) => {
  try {
    const original = await Trip.findById(req.params.id);
    const trip = await tripService.dispatchTrip(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Trips',
      original ? original.toObject() : null,
      trip.toObject ? trip.toObject() : trip,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Trip dispatched successfully.', trip);
  } catch (error) {
    next(error);
  }
};

/**
 * Complete a trip (records fuel efficiency and operational cost, resets status).
 */
const completeTrip = async (req, res, next) => {
  try {
    const original = await Trip.findById(req.params.id);
    const trip = await tripService.completeTrip(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Trips',
      original ? original.toObject() : null,
      trip.toObject ? trip.toObject() : trip,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Trip completed successfully.', trip);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a trip.
 */
const cancelTrip = async (req, res, next) => {
  try {
    const original = await Trip.findById(req.params.id);
    const trip = await tripService.cancelTrip(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Trips',
      original ? original.toObject() : null,
      trip.toObject ? trip.toObject() : trip,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Trip cancelled successfully.', trip);
  } catch (error) {
    next(error);
  }
};

/**
 * Get trip timeline history.
 */
const getTripTimeline = async (req, res, next) => {
  try {
    const timeline = await tripService.getTripTimeline(req.params.id);
    return ApiResponse.success(res, 'Trip timeline fetched successfully.', timeline);
  } catch (error) {
    next(error);
  }
};

/**
 * Get overall dashboard trip statistics.
 */
const getTripStatistics = async (req, res, next) => {
  try {
    const stats = await tripService.getTripStatistics();
    return ApiResponse.success(res, 'Trip statistics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripDetails,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  getTripTimeline,
  getTripStatistics
};
