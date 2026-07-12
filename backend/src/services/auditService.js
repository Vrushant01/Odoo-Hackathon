const auditRepository = require('../repositories/auditRepository');

class AuditService {
  /**
   * Log an operational action.
   */
  async log(userId, action, module, oldValue = null, newValue = null, ipAddress = '', device = '', targetUser = null) {
    try {
      // Cast ObjectId if passed as string
      await auditRepository.create({
        user: userId,
        action,
        module,
        oldValue,
        newValue,
        ipAddress,
        device,
        targetUser
      });
    } catch (error) {
      console.error('[AUDIT ERROR] Failed to record audit log:', error.message);
    }
  }

  /**
   * Retrieve paginated audit logs.
   */
  async getAuditLogs(queryParams) {
    return await auditRepository.findAll(queryParams);
  }
}

module.exports = new AuditService();
