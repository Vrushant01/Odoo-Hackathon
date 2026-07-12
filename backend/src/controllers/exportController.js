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

const PDFDocument = require('pdfkit');

/**
 * Sends a programmatic high-fidelity PDF download response using PDFKit.
 */
const generatePdfDocument = (res, filename, title, sections) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  doc.pipe(res);

  // Styling palette
  const primaryColor = '#0F172A'; // Slate 900
  const secondaryColor = '#475569'; // Slate 600
  const accentColor = '#2563EB'; // Blue 600
  const lightBg = '#F8FAFC'; // Slate 50
  const borderColor = '#E2E8F0'; // Slate 200

  // Title / Banner header
  doc.rect(0, 0, 595, 100).fill(primaryColor);
  
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(20)
     .text('TransitOps Logistics', 50, 25);
     
  doc.font('Helvetica')
     .fontSize(9)
     .fillColor('#94A3B8')
     .text('Smart Transport Operations Platform', 50, 52);

  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(12)
     .text(title, 350, 25, { align: 'right', width: 195 });

  doc.font('Helvetica')
     .fontSize(8)
     .fillColor('#94A3B8')
     .text(`Generated: ${new Date().toLocaleString()}`, 350, 42, { align: 'right', width: 195 });

  let y = 120;

  // Render content sections
  sections.forEach(section => {
    // Check page boundaries
    if (y > 700) {
      doc.addPage();
      y = 50;
    }

    // Section header
    if (section.title) {
      doc.fillColor(accentColor)
         .font('Helvetica-Bold')
         .fontSize(12)
         .text(section.title, 50, y);
      y += 15;
      
      doc.moveTo(50, y)
         .lineTo(545, y)
         .strokeColor(borderColor)
         .lineWidth(1)
         .stroke();
      y += 10;
    }

    // Key-value records
    if (section.type === 'key-value') {
      section.items.forEach(item => {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        doc.fillColor(secondaryColor)
           .font('Helvetica-Bold')
           .fontSize(9)
           .text(item.label, 50, y, { width: 180 });

        doc.fillColor(primaryColor)
           .font('Helvetica')
           .fontSize(9)
           .text(String(item.value !== undefined && item.value !== null ? item.value : 'N/A'), 240, y, { width: 305 });

        y += 16;
      });
      y += 8;
    } 
    // Structured tables
    else if (section.type === 'table') {
      if (y > 730) {
        doc.addPage();
        y = 50;
      }
      
      // Header fill
      doc.rect(50, y, 495, 18).fill(lightBg);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5);
      
      const colWidths = section.colWidths || [];
      const colAligns = section.colAligns || [];
      
      let x = 55;
      section.headers.forEach((h, idx) => {
        const width = colWidths[idx] || 100;
        const align = colAligns[idx] || 'left';
        doc.text(h, x, y + 4, { width: width - 8, align });
        x += width;
      });
      
      y += 18;

      // Rows iteration
      section.rows.forEach(row => {
        if (y > 750) {
          doc.addPage();
          y = 50;
          
          doc.rect(50, y, 495, 18).fill(lightBg);
          doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(8.5);
          let tx = 55;
          section.headers.forEach((h, idx) => {
            const width = colWidths[idx] || 100;
            const align = colAligns[idx] || 'left';
            doc.text(h, tx, y + 4, { width: width - 8, align });
            tx += width;
          });
          y += 18;
        }

        doc.moveTo(50, y)
           .lineTo(545, y)
           .strokeColor(borderColor)
           .lineWidth(0.5)
           .stroke();

        doc.fillColor(secondaryColor).font('Helvetica').fontSize(8.5);
        let rx = 55;
        row.forEach((cell, idx) => {
          const width = colWidths[idx] || 100;
          const align = colAligns[idx] || 'left';
          doc.text(String(cell !== undefined && cell !== null ? cell : ''), rx, y + 4, { width: width - 8, align });
          rx += width;
        });
        
        y += 16;
      });
      
      y += 12;
    }
  });

  // Stamp page counts
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#94A3B8')
       .font('Helvetica')
       .fontSize(7.5)
       .text(`Page ${i + 1} of ${range.count}`, 50, 800, { align: 'center', width: 495 });
  }

  doc.end();
};

// --- CSV Exports ---

const exportVehiclesCsv = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const list = await Vehicle.find(filter);
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
    const filter = { isDeleted: false };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const list = await Driver.find(filter);
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
    const filter = { isDeleted: false };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const list = await Trip.find(filter).populate('vehicle').populate('driver');
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
    const filter = { isDeleted: false };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const list = await FuelLog.find(filter).populate('vehicle');
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
    const filter = { isDeleted: false };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const list = await Expense.find(filter).populate('vehicle');
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
    const filter = { isDeleted: false };
    if (req.query.ids) {
      filter._id = { $in: req.query.ids.split(',') };
    }
    const list = await Maintenance.find(filter).populate('vehicle');
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
    const dashboardService = require('../services/dashboardService');
    const s = await dashboardService.getSummary();
    
    const sections = [
      {
        title: 'Fleet Status Overview',
        type: 'key-value',
        items: [
          { label: 'Total Vehicles', value: s.totalVehicles || 0 },
          { label: 'Vehicles Available', value: s.availableVehicles || 0 },
          { label: 'Vehicles On Trip', value: s.vehiclesOnTrip || 0 },
          { label: 'Vehicles In Shop', value: s.vehiclesInShop || 0 },
          { label: 'Vehicles Retired', value: s.retiredVehicles || 0 }
        ]
      },
      {
        title: 'Driver Operations',
        type: 'key-value',
        items: [
          { label: 'Total Roster', value: s.totalDrivers || 0 },
          { label: 'Available Drivers', value: s.availableDrivers || 0 },
          { label: 'Drivers On Duty', value: s.driversOnTrip || 0 },
          { label: 'Suspended Drivers', value: s.suspendedDrivers || 0 },
          { label: 'Expired Licenses', value: s.licenseExpiredDrivers || 0 }
        ]
      },
      {
        title: 'Trip Statistics',
        type: 'key-value',
        items: [
          { label: 'Total Trips Logged', value: s.totalTrips || 0 },
          { label: 'Dispatched Trips', value: s.dispatchedTrips || 0 },
          { label: 'Completed Trips', value: s.completedTrips || 0 },
          { label: 'Draft / Planned', value: s.draftTrips || 0 },
          { label: 'Cancelled Trips', value: s.cancelledTrips || 0 }
        ]
      },
      {
        title: 'Financial Performance',
        type: 'key-value',
        items: [
          { label: 'Total Revenue', value: `$${(s.revenue || 0).toLocaleString()}` },
          { label: 'Total Operational Cost', value: `$${(s.totalOperationalCost || 0).toLocaleString()}` },
          { label: 'Net Profit', value: `$${(s.profit || 0).toLocaleString()}` },
          { label: 'Fleet Utilization', value: `${s.fleetUtilization || 0}%` },
          { label: 'Avg Fuel Efficiency', value: `${s.averageFuelEfficiency || 0} km/L` }
        ]
      }
    ];

    generatePdfDocument(res, 'dashboard_summary.pdf', 'DASHBOARD SUMMARY', sections);
  } catch (error) {
    next(error);
  }
};

const exportReportPdf = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ isDeleted: false }).limit(10);
    const drivers = await Driver.find({ isDeleted: false }).limit(10);
    const trips = await Trip.find({ isDeleted: false }).populate('vehicle').populate('driver').limit(10);

    const vehicleRows = vehicles.map(v => [
      v.registrationNumber,
      v.vehicleName,
      v.vehicleType,
      `${v.maximumLoadCapacity} kg`,
      v.status
    ]);

    const driverRows = drivers.map(d => [
      d.fullName,
      d.email,
      d.licenseNumber,
      d.status,
      `${d.safetyScore}/100`
    ]);

    const tripRows = trips.map(t => [
      t.tripNumber,
      t.source,
      t.destination,
      t.vehicle ? t.vehicle.registrationNumber : 'N/A',
      t.driver ? t.driver.fullName : 'N/A',
      t.status
    ]);

    const sections = [
      {
        title: 'Active Fleet Sample (Top 10)',
        type: 'table',
        headers: ['Reg Number', 'Name', 'Type', 'Capacity', 'Status'],
        colWidths: [90, 150, 75, 90, 90],
        rows: vehicleRows
      },
      {
        title: 'Operator Directory Sample (Top 10)',
        type: 'table',
        headers: ['Name', 'Email', 'License No', 'Status', 'Safety Score'],
        colWidths: [110, 150, 95, 75, 65],
        rows: driverRows
      },
      {
        title: 'Recent Dispatch Operations (Top 10)',
        type: 'table',
        headers: ['Trip No', 'Source', 'Destination', 'Vehicle', 'Driver', 'Status'],
        colWidths: [100, 95, 95, 80, 75, 50],
        rows: tripRows
      }
    ];

    generatePdfDocument(res, 'fleet_report.pdf', 'FLEET ANALYSIS REPORT', sections);
  } catch (error) {
    next(error);
  }
};

const exportTripPdf = async (req, res, next) => {
  try {
    const TripTimeline = require('../models/TripTimeline');
    const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const timelineEvents = await TripTimeline.find({ tripId: trip._id }).sort({ createdAt: 1 });

    const sections = [
      {
        title: 'Trip Manifest Details',
        type: 'key-value',
        items: [
          { label: 'Trip Number', value: trip.tripNumber },
          { label: 'Cargo Description', value: trip.cargoDescription || 'N/A' },
          { label: 'Cargo Weight', value: `${trip.cargoWeight} kg` },
          { label: 'Planned Distance', value: `${trip.plannedDistance} km` },
          { label: 'Actual Distance', value: trip.actualDistance ? `${trip.actualDistance} km` : 'N/A' },
          { label: 'Actual Duration', value: trip.actualDuration ? `${trip.actualDuration} hrs` : 'N/A' },
          { label: 'Priority Level', value: trip.priority },
          { label: 'Current Status', value: trip.status }
        ]
      },
      {
        title: 'Assigned Assets',
        type: 'key-value',
        items: [
          { label: 'Vehicle Name', value: trip.vehicle ? `${trip.vehicle.vehicleName} (${trip.vehicle.registrationNumber})` : 'Unassigned' },
          { label: 'Vehicle Model', value: trip.vehicle ? trip.vehicle.vehicleModel : 'N/A' },
          { label: 'Driver Name', value: trip.driver ? trip.driver.fullName : 'Unassigned' },
          { label: 'Driver License', value: trip.driver ? trip.driver.licenseNumber : 'N/A' },
          { label: 'Driver Safety Score', value: trip.driver ? `${trip.driver.safetyScore}/100` : 'N/A' }
        ]
      },
      {
        title: 'Financial Summary',
        type: 'key-value',
        items: [
          { label: 'Fuel Consumed', value: trip.fuelConsumed ? `${trip.fuelConsumed} Liters` : 'N/A' },
          { label: 'Fuel Cost', value: `$${trip.fuelCost || 0}` },
          { label: 'Toll Fees', value: `$${trip.tollCost || 0}` },
          { label: 'Other Expenses', value: `$${trip.otherExpenses || 0}` },
          { label: 'Total Trip Cost', value: `$${trip.totalOperationalCost || 0}` }
        ]
      }
    ];

    if (timelineEvents.length > 0) {
      const timelineRows = timelineEvents.map(event => [
        new Date(event.createdAt).toLocaleString(),
        event.eventType,
        event.description
      ]);
      sections.push({
        title: 'Chronological Timeline Events',
        type: 'table',
        headers: ['Timestamp', 'Event Type', 'Details'],
        colWidths: [130, 100, 265],
        rows: timelineRows
      });
    }

    generatePdfDocument(res, `trip_${trip.tripNumber}.pdf`, 'TRIP OPERATION MANIFEST', sections);
  } catch (error) {
    next(error);
  }
};

const exportVehiclePdf = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Fetch related records
    const [maintenanceLogs, fuelLogs, trips] = await Promise.all([
      Maintenance.find({ vehicle: vehicle._id, isDeleted: false }).sort({ scheduledDate: -1 }).limit(5),
      FuelLog.find({ vehicle: vehicle._id, isDeleted: false }).sort({ createdAt: -1 }).limit(5),
      Trip.find({ vehicle: vehicle._id, isDeleted: false }).populate('driver').sort({ createdAt: -1 }).limit(5)
    ]);

    const sections = [
      {
        title: 'Vehicle Specifications',
        type: 'key-value',
        items: [
          { label: 'Registration Number', value: vehicle.registrationNumber },
          { label: 'Vehicle Name', value: vehicle.vehicleName },
          { label: 'Manufacturer', value: vehicle.manufacturer },
          { label: 'Model Series', value: vehicle.vehicleModel },
          { label: 'Body Type', value: vehicle.vehicleType },
          { label: 'Fuel Type', value: vehicle.fuelType },
          { label: 'Max Load Capacity', value: `${vehicle.maximumLoadCapacity} kg` },
          { label: 'Odometer (Current)', value: `${vehicle.currentOdometer} km` },
          { label: 'Acquisition Cost', value: `$${vehicle.acquisitionCost.toLocaleString()}` },
          { label: 'Operating Status', value: vehicle.status },
          { label: 'Operating Region', value: vehicle.region }
        ]
      }
    ];

    if (maintenanceLogs.length > 0) {
      const maintRows = maintenanceLogs.map(m => [
        m.maintenanceNumber,
        m.maintenanceType,
        new Date(m.scheduledDate).toLocaleDateString(),
        m.status,
        `$${m.finalCost || m.estimatedCost}`
      ]);
      sections.push({
        title: 'Recent Maintenance Logs',
        type: 'table',
        headers: ['Maint No', 'Type', 'Date', 'Status', 'Cost'],
        colWidths: [100, 100, 100, 95, 100],
        rows: maintRows
      });
    }

    if (fuelLogs.length > 0) {
      const fuelRows = fuelLogs.map(f => [
        f.fuelLogNumber,
        new Date(f.createdAt).toLocaleDateString(),
        `${f.quantity} L`,
        `$${f.pricePerUnit}`,
        `$${f.totalCost}`
      ]);
      sections.push({
        title: 'Recent Refueling Logs',
        type: 'table',
        headers: ['Refuel No', 'Date', 'Qty', 'Unit Price', 'Total Cost'],
        colWidths: [100, 100, 95, 100, 100],
        rows: fuelRows
      });
    }

    if (trips.length > 0) {
      const tripRows = trips.map(t => [
        t.tripNumber,
        t.source,
        t.destination,
        t.driver ? t.driver.fullName : 'N/A',
        t.status
      ]);
      sections.push({
        title: 'Recent Assigned Trips',
        type: 'table',
        headers: ['Trip No', 'Origin', 'Destination', 'Driver', 'Status'],
        colWidths: [100, 100, 100, 100, 95],
        rows: tripRows
      });
    }

    generatePdfDocument(res, `vehicle_${vehicle.registrationNumber}.pdf`, 'VEHICLE RECORD SHEET', sections);
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
