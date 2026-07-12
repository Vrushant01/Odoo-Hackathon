const User = require('../models/User');
const { applyQueryOptions } = require('../utils/queryHelper');

class UserRepository {
  /**
   * Find a user by their unique MongoDB ID.
   * @param {string} id - User ID
   * @param {boolean} includePassword - If true, force include the password field
   */
  async findById(id, includePassword = false) {
    let query = User.findById(id);
    if (includePassword) {
      query = query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Find a user by their email address.
   * @param {string} email - Email address
   * @param {boolean} includePassword - If true, force include the password field
   */
  async findByEmail(email, includePassword = false) {
    let query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query = query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Create and persist a new user record.
   * @param {Object} userData - User creation attributes
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find and update a specific user.
   * @param {string} id - User ID
   * @param {Object} updateData - Attributes to update
   */
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).exec();
  }

  /**
   * Delete a user by ID.
   * @param {string} id - User ID
   */
  async delete(id) {
    return await User.findByIdAndDelete(id).exec();
  }

  /**
   * Retrieve users using the query helper (pagination, searching, sorting, filters).
   * @param {Object} queryParams - Express query parameters
   */
  async findAll(queryParams) {
    const searchableFields = ['fullName', 'email', 'phoneNumber'];
    return await applyQueryOptions(User, queryParams, searchableFields);
  }
}

module.exports = new UserRepository();
