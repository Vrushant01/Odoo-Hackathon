const expenseService = require('../services/expenseService');
const Expense = require('../models/Expense');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

const mapUploadedFiles = (req) => {
  if (req.files && req.files.attachments) {
    req.body.attachments = req.files.attachments.map(file => `/uploads/expenses/${file.filename}`);
  }
};

const createExpense = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const expense = await expenseService.createExpense(req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'CREATE',
      'Expenses',
      null,
      expense.toObject ? expense.toObject() : expense,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Expense created successfully.', expense, 201);
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const data = await expenseService.getExpenses(req.query);
    return ApiResponse.success(res, 'Expenses fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

const getExpenseDetails = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseDetails(req.params.id);
    return ApiResponse.success(res, 'Expense details fetched successfully.', expense);
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const original = await Expense.findById(req.params.id);
    const expense = await expenseService.updateExpense(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'UPDATE',
      'Expenses',
      original ? original.toObject() : null,
      expense.toObject ? expense.toObject() : expense,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Expense updated successfully.', expense);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const original = await Expense.findById(req.params.id);
    await expenseService.deleteExpense(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'DELETE',
      'Expenses',
      original ? original.toObject() : null,
      null,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Expense deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const getExpenseStatistics = async (req, res, next) => {
  try {
    const stats = await expenseService.getExpenseStatistics();
    return ApiResponse.success(res, 'Expense statistics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

const getExpensesByVehicle = async (req, res, next) => {
  try {
    const data = await expenseService.getExpensesByVehicle(req.params.vehicleId);
    return ApiResponse.success(res, 'Expenses for vehicle fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseDetails,
  updateExpense,
  deleteExpense,
  getExpenseStatistics,
  getExpensesByVehicle
};
