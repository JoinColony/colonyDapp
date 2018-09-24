/* @flow */

type TimeFormatOptions = {
  showHours: boolean,
  showMinutes: boolean,
  showSeconds: boolean,
  showLeadingZeros: boolean,
  separator: string,
};

/**
 * @method timeDifferenceInSeconds
 *
 * Simple helper utility to compoare two date objects and return the difference between them (in seconds).
 *
 * @param {object} firstDateObject Date object to compare against
 * @param {object} secondDateObject Date object to compare with
 *
 * @return {number} Number of seconds difference (0 if negative)
 */
export const timeDifferenceInSeconds = (
  firstDateObject: Date = new Date(),
  secondDateObject: Date = new Date(),
) => {
  /*
   * @NOTE
   * Don't allow negative differences. If the second date object is older than the first one, just return 0;
   */
  if (firstDateObject - secondDateObject <= 0) {
    return 0;
  }
  return Math.floor((firstDateObject - secondDateObject) / 1000);
};

/**
 * @method extractHours
 *
 * Extract the number of hours out of a given number of seconds, rounded down
 * .
 * 86399 secs (a day minus a second) will output 23 hours (23:59:59)
 *
 * @param {number} seconds Number of seconds to extract the hours out of
 *
 * @return {number} Number of extracted hours
 */
export const extractHours = (seconds: number = 0) => Math.floor(seconds / 3600);

/**
 * @method extractMinutes
 *
 * Extract the number of minutes out of a given number of seconds, rounded down
 * .
 * 3599 secs (an hour minus a second) will output 59 minutes (59:59)
 *
 * @param {number} seconds Number of seconds to extract the hours out of
 *
 * @return {number} Number of extracted minutes
 */
export const extractMinutes = (seconds: number = 0) => Math.floor(seconds / 60);

/**
 * @method formattedTimeNumeric
 *
 * Output a string showing a formatted time in numeric form
 *
 * We had to write this helper since the `react-intl` formatRelative shows time in only "human readable" form.
 * While you can use directly, it's advisable that you make use of in the context of the `Time` core component.
 *
 * @TODO
 * Add better time locale formatting (although this can be faked with clever use of the separator config option)
 *
 * Add option to subtract the time mesurement but don't show it.
 * Eg: 1 day (short a second) in hours and seconds! is 23 hours 3599 seconds
 * This is because we don't extract the minutes from this (since we don't show them), so to have a nice
 * formatting like 23 59 59 we also have to show the minutes.
 *
 * @param {object} firstDateObject Date object to compare against
 * @param {object} secondDateObject Date object to compare with
 * @param {[type]} optionsObject Formatting options object
 *
 * @return {string} The formatted time string
 */
export const formattedTimeNumeric = (
  firstDateObject: Date = new Date(),
  secondDateObject: Date = new Date(),
  optionsObject: TimeFormatOptions,
) => {
  const optionsObjectWithDefaults = {
    /*
     * @NOTE
     * showHours - Show the number of remaining hours
     * showMinutes - Show the number of remaining minutes (if we are also showing hours, then show only the remaining minutes)
     * showSeconds - Show the number of remaining seconds (if we are also showing hours and minutes, then show only the remaining seconds)
     * showLeadingZeros - Display a leading 0 if the time value is lower than 9 (Eg: 09:03 vs 9:3)
     * separator - Symbol to show between time mesurement units
     */
    showHours: true,
    showMinutes: true,
    showSeconds: false,
    showLeadingZeros: true,
    separator: ' ',
    ...optionsObject,
  };
  const {
    showHours,
    showMinutes,
    showSeconds,
    separator,
    showLeadingZeros,
  } = optionsObjectWithDefaults;
  let formattedTimeString = '';
  let timeDifferenceInHours = 0;
  let timeDifferenceInMinutes = 0;
  let differenceInSeconds = timeDifferenceInSeconds(
    firstDateObject,
    secondDateObject,
  );
  /*
   * @NOTE Small helper functions to cut down on code repetition
   */
  const renderleadingZero = time =>
    showLeadingZeros && time >= 0 && time <= 9 ? '0' : '';
  const renderSeparator = show => (show ? separator : '');
  const renderTimeUnit = (timeUnit, showSeparator = false) =>
    renderleadingZero(timeUnit) + timeUnit + renderSeparator(showSeparator);
  /*
   * @NOTE Hours
   */
  if (showHours) {
    timeDifferenceInHours = extractHours(differenceInSeconds);
    differenceInSeconds -= timeDifferenceInHours * 3600;
    formattedTimeString += renderTimeUnit(
      timeDifferenceInHours,
      showMinutes || showSeconds,
    );
  }
  /*
   * @NOTE Minutes
   */
  if (showMinutes) {
    timeDifferenceInMinutes = extractMinutes(differenceInSeconds);
    differenceInSeconds -= timeDifferenceInMinutes * 60;
    formattedTimeString += renderTimeUnit(timeDifferenceInMinutes, showSeconds);
  }
  /*
   * @NOTE Seconds remaining or all.
   */
  if (showSeconds) {
    formattedTimeString += renderTimeUnit(differenceInSeconds);
  }
  return formattedTimeString;
};
