const AuditLog = require('../models/AuditLog');
const { applyQueryOptions } = require('../utils/queryHelper');

class AuditRepository {
  /**
   * Write an audit log entry.
   */
  async create(data) {
    const log = new AuditLog(data);
    return await log.save();
  }

  /**
   * Get audit log entries (paginated, sorted, filtered).
   */
  async findAll(queryParams) {
    const searchableFields = ['action', 'module'];
    const queryParamsWithFilter = {
      ...queryParams
    };

    return await applyQueryOptions(
      AuditLog,
      queryParamsWithFilter,
      searchableFields,
      ['user', 'targetUser']
    );
  }
}

module.exports = new AuditRepository();
