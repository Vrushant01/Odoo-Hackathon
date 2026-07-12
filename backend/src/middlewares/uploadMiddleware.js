const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadBaseDir = process.env.UPLOAD_PATH || 'uploads';

// Initialize and prepare storage subdirectories
const subDirs = ['profiles', 'vehicles', 'drivers', 'maintenance', 'reports'];
subDirs.forEach((dir) => {
  const fullPath = path.join(uploadBaseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Configure Multer Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'reports';
    
    // Determine destination subfolder based on fieldname or route context
    if (file.fieldname === 'profileImage' || req.originalUrl.includes('profile')) {
      folder = 'profiles';
    } else if (req.originalUrl.includes('vehicle')) {
      folder = 'vehicles';
    } else if (req.originalUrl.includes('driver')) {
      folder = 'drivers';
    } else if (req.originalUrl.includes('maintenance')) {
      folder = 'maintenance';
    }
    
    cb(null, path.join(uploadBaseDir, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File Type Filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
  }
};

// Create the configured multer middleware instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Max 10MB per file
  }
});

module.exports = upload;
