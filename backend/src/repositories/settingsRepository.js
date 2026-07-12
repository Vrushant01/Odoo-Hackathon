const Settings = require('../models/Settings');

class SettingsRepository {
  /**
   * Fetch current system settings.
   * Auto-seeds a default config if empty.
   */
  async get() {
    let settings = await Settings.findOne().exec();
    if (!settings) {
      settings = new Settings({
        companyName: 'TransitOps Fleet Management',
        defaultRegion: 'North',
        defaultCurrency: 'USD',
        fuelUnit: 'Liters',
        distanceUnit: 'Kilometers',
        timezone: 'UTC',
        emailSettings: {
          host: 'smtp.mailtrap.io',
          port: 2525,
          secure: false,
          senderEmail: 'no-reply@transitops.com'
        }
      });
      await settings.save();
    }
    return settings;
  }

  /**
   * Update system settings.
   */
  async update(data) {
    const current = await this.get();
    return await Settings.findByIdAndUpdate(current._id, data, {
      new: true,
      runValidators: true
    }).exec();
  }
}

module.exports = new SettingsRepository();
