/**
 * Date utilities for booking: normalize to start of day (UTC) for consistency.
 * Used for duplicate booking check and capacity checks.
 */

/**
 * Returns start of day (UTC) for a given date.
 * @param {Date|string|number} date
 * @returns {Date}
 */
function startOfDayUTC(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return d;
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns end of day (UTC) = start of next day.
 * @param {Date|string|number} date
 * @returns {Date}
 */
function endOfDayUTC(date) {
  const d = startOfDayUTC(date);
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

/**
 * Returns true if the given date is in the past (before start of today UTC).
 * @param {Date|string|number} date
 * @returns {boolean}
 */
function isPastDate(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return true;
  const today = startOfDayUTC(new Date());
  return d.getTime() < today.getTime();
}

module.exports = { startOfDayUTC, endOfDayUTC, isPastDate };
