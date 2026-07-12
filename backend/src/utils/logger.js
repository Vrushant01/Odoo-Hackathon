const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m",   // Cyan
  warn: "\x1b[33m",   // Yellow
  error: "\x1b[31m",  // Red
  debug: "\x1b[90m"   // Grey
};

const logger = {
  info: (msg) => {
    console.log(`${colors.info}[INFO] [${new Date().toISOString()}] ${msg}${colors.reset}`);
  },
  warn: (msg) => {
    console.warn(`${colors.warn}[WARN] [${new Date().toISOString()}] ${msg}${colors.reset}`);
  },
  error: (msg) => {
    console.error(`${colors.error}[ERROR] [${new Date().toISOString()}] ${msg}${colors.reset}`);
  },
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${colors.debug}[DEBUG] [${new Date().toISOString()}] ${msg}${colors.reset}`);
    }
  }
};

module.exports = logger;
