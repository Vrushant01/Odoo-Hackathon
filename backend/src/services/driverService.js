const driverRepository = require('../repositories/driverRepository');
const Trip = require('../models/Trip');
const DriverTimeline = require('../models/DriverTimeline');
const ApiError = require('../utils/apiError');

class DriverService {
  /**
   * Register a new driver.
   */
  async registerDriver(driverData, userId) {
    const { email, licenseNumber, licenseExpiryDate } = driverData;

    // Email uniqueness check
    const existingEmail = await driverRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(`Driver with email '${email}' is already registered`, 400);
    }

    // License uniqueness check
    const existingLicense = await driverRepository.findByLicense(licenseNumber);
    if (existingLicense) {
      throw new ApiError(`Driver with license number '${licenseNumber}' already exists`, 400);
    }

    // Auto check license expiry
    const today = new Date();
    const expiry = new Date(licenseExpiryDate);
    
    // Set initial status to 'License Expired' if dates mismatch
    if (expiry < today) {
      driverData.status = 'License Expired';
    }

    const dataToSave = {
      ...driverData,
      createdBy: userId,
      updatedBy: userId
    };

    const driver = await driverRepository.create(dataToSave);

    // Write timeline record
    await driverRepository.createTimeline({
      driverId: driver.id,
      eventType: 'Driver Registered',
      description: `Driver registered with license number '${driver.licenseNumber}'.`,
      createdBy: userId
    });

    return driver;
  }

  /**
   * Get all drivers (paginated, sorted, filtered).
   */
  async getDrivers(queryParams) {
    // Run automated license validations
    await driverRepository.checkExpiredLicenses();
    
    const { results, page, limit, totalPages, totalResults } = await driverRepository.findAll(queryParams);
    
    return {
      drivers: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults
      }
    };
  }

  /**
   * Get detailed driver profile, performance reports, and timeline.
   */
  async getDriverDetails(id) {
    await driverRepository.checkExpiredLicenses();
    
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    // Fetch related logs
    const [trips, timeline, performance] = await Promise.all([
      Trip.find({ driverId: id }).sort({ createdAt: -1 }),
      DriverTimeline.find({ driverId: id }).sort({ createdAt: -1 }).limit(10).populate('createdBy', 'fullName'),
      this.getPerformance(id)
    ]);

    return {
      driver,
      performance,
      timeline,
      recentTrips: trips.slice(0, 5)
    };
  }

  /**
   * Update driver attributes.
   */
  async updateDriver(id, updateData, userId) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    // Filter forbidden fields
    const forbidden = ['_id', 'createdAt', 'createdBy', 'isDeleted', 'deletedAt', 'deletedBy'];
    forbidden.forEach(k => delete updateData[k]);

    // Validation uniqueness checks
    if (updateData.email && updateData.email.toLowerCase() !== driver.email) {
      const existingEmail = await driverRepository.findByEmail(updateData.email);
      if (existingEmail) {
        throw new ApiError(`Email '${updateData.email}' is already in use`, 400);
      }
      updateData.email = updateData.email.toLowerCase();
    }

    if (updateData.licenseNumber && updateData.licenseNumber.toUpperCase() !== driver.licenseNumber) {
      const existingLicense = await driverRepository.findByLicense(updateData.licenseNumber);
      if (existingLicense) {
        throw new ApiError(`License number '${updateData.licenseNumber}' is already registered`, 400);
      }
      updateData.licenseNumber = updateData.licenseNumber.toUpperCase();
    }

    // Handle license expiry validations on update
    if (updateData.licenseExpiryDate) {
      const today = new Date();
      const expiry = new Date(updateData.licenseExpiryDate);
      
      if (expiry < today) {
        updateData.status = 'License Expired';
      } else if (driver.status === 'License Expired' && expiry >= today) {
        updateData.status = 'Available'; // Auto restore if was expired
        
        await driverRepository.createTimeline({
          driverId: id,
          eventType: 'License Renewed',
          description: 'Driving license renewed and updated.',
          createdBy: userId
        });
      } else {
        await driverRepository.createTimeline({
          driverId: id,
          eventType: 'License Updated',
          description: 'Driving license expiry date updated.',
          createdBy: userId
        });
      }
    }

    updateData.updatedBy = userId;

    const updatedDriver = await driverRepository.update(id, updateData);

    await driverRepository.createTimeline({
      driverId: id,
      eventType: 'Profile Updated',
      description: 'Driver profile parameters updated.',
      createdBy: userId
    });

    return updatedDriver;
  }

  /**
   * Soft delete driver.
   */
  async deleteDriver(id, userId) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    await driverRepository.softDelete(id, userId);
    return true;
  }

  /**
   * Suspend a driver.
   */
  async suspendDriver(id, suspendData, userId) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    if (driver.status === 'Suspended') {
      throw new ApiError('Driver is already suspended', 400);
    }

    const updatedDriver = await driverRepository.update(id, {
      status: 'Suspended',
      updatedBy: userId
    });

    // Write timeline record
    await driverRepository.createTimeline({
      driverId: id,
      eventType: 'Suspended',
      description: `Driver suspended. Reason: ${suspendData.reason || 'Not specified'}. Remarks: ${suspendData.remarks || 'None'}`,
      metadata: suspendData,
      createdBy: userId
    });

    return updatedDriver;
  }

  /**
   * Activate suspended driver.
   */
  async activateDriver(id, userId) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    const today = new Date();
    if (driver.licenseExpiryDate < today) {
      throw new ApiError('Cannot activate driver with an expired license.', 400);
    }

    const updatedDriver = await driverRepository.update(id, {
      status: 'Available',
      updatedBy: userId
    });

    await driverRepository.createTimeline({
      driverId: id,
      eventType: 'Activated',
      description: 'Driver activated back to Available status.',
      createdBy: userId
    });

    return updatedDriver;
  }

  /**
   * Get driver history logs.
   */
  async getDriverHistory(id) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    const [trips, timeline] = await Promise.all([
      Trip.find({ driverId: id }).sort({ createdAt: -1 }),
      DriverTimeline.find({ driverId: id }).sort({ createdAt: -1 }).populate('createdBy', 'fullName')
    ]);

    return {
      trips,
      timeline
    };
  }

  /**
   * Compute performance analytics for a driver.
   */
  async getPerformance(driverId) {
    const driver = await driverRepository.findById(driverId);
    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    const trips = await Trip.find({ driverId });
    
    const completedTrips = trips.filter(t => t.status === 'Completed');
    const cancelledTrips = trips.filter(t => t.status === 'Cancelled');
    
    const distanceCovered = completedTrips.reduce((acc, curr) => acc + (curr.finalDistance || curr.plannedDistance || 0), 0);
    const totalFuelConsumed = completedTrips.reduce((acc, curr) => acc + (curr.fuelConsumed || 0), 0);

    const averageFuelEfficiency = totalFuelConsumed > 0 
      ? parseFloat((distanceCovered / totalFuelConsumed).toFixed(2))
      : 0;

    return {
      completedTrips: completedTrips.length,
      cancelledTrips: cancelledTrips.length,
      distanceCovered: round(distanceCovered, 2),
      averageFuelEfficiency,
      averageRating: 4.7, // Mocked rating out of 5
      safetyScore: driver.safetyScore,
      violations: 0, // Placeholder
      accidents: 0 // Placeholder
    };
  }

  /**
   * Get overall driver stats.
   */
  async getDriverStatistics() {
    return await driverRepository.getStats();
  }
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

module.exports = new DriverService();
