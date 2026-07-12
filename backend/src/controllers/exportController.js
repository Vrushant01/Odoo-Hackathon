const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const Maintenance = require('../models/Maintenance');

/**
 * Sends a CSV download response.
 */
const sendCsvResponse = (res, filename, csvString) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  return res.status(200).send(csvString);
};

/**
 * Sends a mock PDF download response.
 */
const sendPdfResponse = (res, filename) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  // Minimal valid PDF header structure
  const pdfHeader = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT /F1 24 Tf 100 700 Td (TransitOps PDF Document Export) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000210 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n310\n%%EOF';
  return res.status(200).send(Buffer.from(pdfHeader, 'utf-8'));
};

// --- CSV Exports ---

const exportVehiclesCsv = async (req, res, next) => {
  try {
    const list = await Vehicle.find({ isDeleted: false });
    let csv = 'Registration Number,Name,Model,Type,Capacity,Odometer,Status,Region\n';
    list.forEach(v => {
      csv += `"${v.registrationNumber}","${v.vehicleName}","${v.vehicleModel}","${v.vehicleType}",${v.maximumLoadCapacity},${v.currentOdometer},"${v.status}","${v.region}"\n`;
    });
    return sendCsvResponse(res, 'vehicles.csv', csv);
  } catch (error) {
    next(error);
  }
};

const exportDriversCsv = async (req, res, next) => {
  try {
    const list = await Driver.find({ isDeleted: false });
    let csv = 'Full Name,Email,Phone,License Number,Category,Expiry,Status,Safety Score\n';
    list.forEach(d => {
      const expiry = d.licenseExpiryDate ? new Date(d.licenseExpiryDate).toISOString().slice(0, 10) : '';
      csv += `"${d.fullName}","${d.email}","${d.phoneNumber}","${d.licenseNumber}","${d.licenseCategory}","${expiry}","${d.status}",${d.safetyScore}\n`;
    });
    return sendCsvResponse(res, 'drivers.csv', csv);
  } catch (error) {
    next(error);
  }
};

const exportTripsCsv = async (req, res, next) => {
  try {
    const list = await Trip.find({ isDeleted: false }).populate('vehicle').populate('driver');
    let csv = 'Trip Number,Source,Destination,Vehicle,Driver,Cargo,Weight,Distance,Status,Operational Cost\n';
    list.forEach(t => {
      const v = t.vehicle ? t.vehicle.registrationNumber : '';
      const d = t.driver ? t.driver.fullName : '';
      csv += `"${t.tripNumber}","${t.source}","${t.destination}","${v}","${d}","${t.cargoDescription || ''}",${t.cargoWeight},${t.actualDistance || t.plannedDistance},"${t.status}",${t.totalOperationalCost}\n`;
    });
    return sendCsvResponse(res, 'trips.csv', csv);
  } catch (error) {
    next(error);
  }
};

const exportFuelCsv = async (req, res, next) => {
  try {
    const list = await FuelLog.find({ isDeleted: false }).populate('vehicle');
    let csv = 'Fuel Log Number,Vehicle,Station,Quantity,Price Per Unit,Total Cost,Odometer,Invoice\n';
    list.forEach(f => {
      const v = f.vehicle ? f.vehicle.registrationNumber : '';
      csv += `"${f.fuelLogNumber}","${v}","${f.fuelStation || ''}",${f.quantity},${f.pricePerUnit},${f.totalCost},${f.currentOdometer || ''},"${f.invoiceNumber || ''}"\n`;
    });
    return sendCsvResponse(res, 'fuel_logs.csv', csv);
  } catch (error) {
    next(error);
  }
};

const exportExpensesCsv = async (req, res, next) => {
  try {
    const list = await Expense.find({ isDeleted: false }).populate('vehicle');
    let csv = 'Expense Number,Vehicle,Type,Vendor,Amount,Payment Method,Invoice,Status\n';
    list.forEach(e => {
      const v = e.vehicle ? e.vehicle.registrationNumber : '';
      csv += `"${e.expenseNumber}","${v}","${e.expenseType}","${e.vendor || ''}",${e.amount},"${e.paymentMethod || ''}","${e.invoiceNumber || ''}","${e.paymentStatus}"\n`;
    });
    return sendCsvResponse(res, 'expenses.csv', csv);
  } catch (error) {
    next(error);
  }
};

const exportMaintenanceCsv = async (req, res, next) => {
  try {
    const list = await Maintenance.find({ isDeleted: false }).populate('vehicle');
    let csv = 'Maintenance Number,Vehicle,Type,Category,Priority,Status,Workshop,Cost\n';
    list.forEach(m => {
      const v = m.vehicle ? m.vehicle.registrationNumber : '';
      csv += `"${m.maintenanceNumber}","${v}","${m.maintenanceType}","${m.category}","${m.priority}","${m.status}","${m.workshop || ''}",${m.finalCost || m.estimatedCost}\n`;
    });
    return sendCsvResponse(res, 'maintenance.csv', csv);
  } catch (error) {
    next(error);
  }
};

// --- PDF Exports ---

const exportDashboardPdf = async (req, res, next) => {
  try {
    return sendPdfResponse(res, 'dashboard_summary.pdf');
  } catch (error) {
    next(error);
  }
};

const exportReportPdf = async (req, res, next) => {
  try {
    return sendPdfResponse(res, 'fleet_report.pdf');
  } catch (error) {
    next(error);
  }
};

const exportTripPdf = async (req, res, next) => {
  try {
    return sendPdfResponse(res, `trip_${req.params.id}.pdf`);
  } catch (error) {
    next(error);
  }
};

const exportVehiclePdf = async (req, res, next) => {
  try {
    return sendPdfResponse(res, `vehicle_${req.params.id}.pdf`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportVehiclesCsv,
  exportDriversCsv,
  exportTripsCsv,
  exportFuelCsv,
  exportExpensesCsv,
  exportMaintenanceCsv,
  exportDashboardPdf,
  exportReportPdf,
  exportTripPdf,
  exportVehiclePdf
};
