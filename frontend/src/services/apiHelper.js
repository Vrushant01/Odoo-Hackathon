/**
 * Helper function to simulate network latency with promises
 */
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulate a mock API response wrapper
 */
export const mockResponse = async (data, ms = 300) => {
  await delay(ms);
  return data;
};
