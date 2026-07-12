/**
 * Reusable utility to handle Mongoose queries with pagination, searching, sorting, and filtering.
 * 
 * @param {Object} model - Mongoose Model
 * @param {Object} queryParams - Request query parameters (req.query)
 * @param {Array<string>} searchableFields - Fields to search using regex (e.g. ['fullName', 'email'])
 * @param {Array<string|Object>} populateOptions - Relations to populate
 */
const applyQueryOptions = async (model, queryParams, searchableFields = [], populateOptions = []) => {
  const { page = 1, limit = 10, sort, search, ...filters } = queryParams;

  const query = {};

  // 1. Filtering
  Object.keys(filters).forEach((key) => {
    const val = filters[key];
    if (val === undefined || val === null || val === '') return;

    // Date range handling (e.g., startDate and endDate)
    if (key === 'startDate') {
      query.createdAt = { ...query.createdAt, $gte: new Date(val) };
    } else if (key === 'endDate') {
      query.createdAt = { ...query.createdAt, $lte: new Date(val) };
    } else if (typeof val === 'string' && val.includes(',')) {
      // Support comma-separated values (like status=Active,Suspended)
      query[key] = { $in: val.split(',') };
    } else {
      query[key] = val;
    }
  });

  // 2. Searching
  if (search && searchableFields.length > 0) {
    const searchConditions = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' }
    }));
    query.$or = searchConditions;
  }

  // 3. Sorting
  let sortOption = {};
  if (sort) {
    // e.g. sort=role,-createdAt
    const sortFields = sort.split(',');
    sortFields.forEach((field) => {
      if (field.startsWith('-')) {
        sortOption[field.substring(1)] = -1;
      } else {
        sortOption[field] = 1;
      }
    });
  } else {
    sortOption.createdAt = -1; // Default: newest first
  }

  // 4. Pagination
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  // Build final query
  let dbQuery = model.find(query).sort(sortOption).skip(skip).limit(limitNum);

  // Populate relations
  populateOptions.forEach((option) => {
    dbQuery = dbQuery.populate(option);
  });

  const [results, totalResults] = await Promise.all([
    dbQuery.exec(),
    model.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalResults / limitNum);

  return {
    results,
    page: pageNum,
    limit: limitNum,
    totalPages,
    totalResults
  };
};

module.exports = { applyQueryOptions };
