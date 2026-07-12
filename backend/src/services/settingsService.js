const settingsRepository = require('../repositories/settingsRepository');

class SettingsService {
  /**
   * Fetch current system configurations.
   */
  async getSettings() {
    return await settingsRepository.get();
  }

  /**
   * Update configuration parameters.
   */
  async updateSettings(settingsData) {
    return await settingsRepository.update(settingsData);
  }
}

module.exports = new SettingsService();
