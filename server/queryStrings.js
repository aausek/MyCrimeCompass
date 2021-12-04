module.exports = {
  // Crimes by Quadrants of longitude/latitude
  Quadrants: `SELECT
  quadrants.crime_year     "Year",
  quadrants.quadrant       "Quadrant",
  COUNT(quadrants.offense) "Crime Count"
FROM
  (
      SELECT
          d.year       crime_year,
          CASE
              WHEN c.latitude > avg_lat
                   AND c.longitude < avg_long THEN
                  'NW'
              WHEN c.latitude > avg_lat
                   AND c.longitude > avg_long THEN
                  'NE'
              WHEN c.latitude < avg_lat
                   AND c.longitude < avg_long THEN
                  'SW'
              WHEN c.latitude < avg_lat
                   AND c.longitude > avg_long THEN
                  'SE'
              ELSE
                  'Unknown'
          END          quadrant,
          c.offense_id offense
      FROM
               nmoody9899.crime c
          JOIN nmoody9899.dates d ON c.offense_start_date = d.calendar_date,
          (
              SELECT
                  AVG(crime.longitude) avg_long,
                  AVG(crime.latitude)  avg_lat
              FROM
                       nmoody9899.crime
                  JOIN nmoody9899.dates ON crime.offense_start_date = dates.calendar_date
              WHERE
                      dates.year >= 2008
                  AND crime.latitude <> 0
                  AND crime.longitude <> 0
          )
  ) quadrants
WHERE
  quadrants.crime_year >= 2008
GROUP BY
  quadrants.crime_year,
  quadrants.quadrant`,

  // 100 blocks with the most crime by year/month
  CrimeBlocks: `SELECT 
  HIGHEST_CRIMES.CRIME_YEAR "Year"
  ,HIGHEST_CRIMES.CRIME_MONTH "Month"
  ,HIGHEST_CRIMES.ADDRESS "100 Block Address"
  ,HIGHEST_CRIMES.OFFENSE_COUNT "Crime Count"
FROM (
  SELECT
      ADDRESSES.CRIME_YEAR "CRIME_YEAR"
      ,ADDRESSES.CRIME_MONTH "CRIME_MONTH"
      ,ADDRESSES.ADDRESS "ADDRESS"
      ,COUNT(ADDRESSES.OFFENSE) "OFFENSE_COUNT"
      ,RANK() OVER (PARTITION BY
          ADDRESSES.CRIME_YEAR, ADDRESSES.CRIME_MONTH
          ORDER BY COUNT(ADDRESSES.OFFENSE) DESC
      ) "RANKING"
  FROM (
      SELECT 
          D.YEAR "CRIME_YEAR"
          ,D.MONTH_NAME "CRIME_MONTH"
          ,REPLACE(ONE_HUNDRED_BLOCK_ADDRESS, 'XX', '00') "ADDRESS"
          ,C.OFFENSE_ID "OFFENSE"
      FROM nmoody9899.CRIME C 
          JOIN nmoody9899.DATES D
              ON C.OFFENSE_START_DATE = D.CALENDAR_DATE
      WHERE D.YEAR >= 2008
          AND C.ONE_HUNDRED_BLOCK_ADDRESS IS NOT NULL
  ) ADDRESSES
  GROUP BY ADDRESSES.CRIME_YEAR, ADDRESSES.CRIME_MONTH, ADDRESSES.ADDRESS
) HIGHEST_CRIMES
WHERE HIGHEST_CRIMES.RANKING <= 5`,

  // AVERAGE TIME OF DAY
  TimeOfDay: `SELECT
      CRIME_RANKINGS.CRIME_YEAR "Year"
      ,CRIME_RANKINGS.CRIME_MONTH "Month"
      ,CRIME_RANKINGS.CRIME_TIME_FRAME "Time Frame"
      ,CRIME_RANKINGS.CRIME_COUNT "Number of Crimes"
  FROM (
      SELECT
          CRIME_TIMES.CRIME_YEAR "CRIME_YEAR"
          ,CRIME_TIMES.CRIME_MONTH "CRIME_MONTH"
          ,CRIME_TIMES.CRIME_TIME "CRIME_TIME_FRAME"
          ,COUNT(CRIME_TIMES.OFFENSE_ID) "CRIME_COUNT"
          ,RANK() OVER (
              PARTITION BY CRIME_TIMES.CRIME_YEAR, CRIME_TIMES.CRIME_MONTH
              ORDER BY COUNT(CRIME_TIMES.OFFENSE_ID) DESC) "RANKING"
      FROM (
          SELECT
              D.YEAR "CRIME_YEAR"
              ,D.MONTH_NAME "CRIME_MONTH"
              ,CASE
                  WHEN T.AM_OR_PM = 'AM'
                      THEN CASE
                          WHEN T.TIME_HOUR = 12 THEN '12:00am - 1:00am'
                          WHEN T.TIME_HOUR = 1 THEN '1:00am - 2:00am'
                          WHEN T.TIME_HOUR = 2 THEN '2:00am - 3:00am'
                          WHEN T.TIME_HOUR = 3 THEN '3:00am - 4:00am'
                          WHEN T.TIME_HOUR = 4 THEN '4:00am - 5:00am'
                          WHEN T.TIME_HOUR = 5 THEN '5:00am - 6:00am'
                          WHEN T.TIME_HOUR = 6 THEN '6:00am - 7:00am'
                          WHEN T.TIME_HOUR = 7 THEN '7:00am - 8:00am'
                          WHEN T.TIME_HOUR = 8 THEN '8:00am - 9:00am'
                          WHEN T.TIME_HOUR = 9 THEN '9:00am - 10:00am'
                          WHEN T.TIME_HOUR = 10 THEN '10:00am - 11:00am'
                          WHEN T.TIME_HOUR = 11 THEN '11:00am - 12:00pm'
                          ELSE NULL END
                  WHEN T.AM_OR_PM = 'PM'
                      THEN CASE
                          WHEN T.TIME_HOUR = 12 THEN '12:00pm - 1:00pm'
                          WHEN T.TIME_HOUR = 1 THEN '1:00pm - 2:00pm'
                          WHEN T.TIME_HOUR = 2 THEN '2:00pm - 3:00pm'
                          WHEN T.TIME_HOUR = 3 THEN '3:00pm - 4:00pm'
                          WHEN T.TIME_HOUR = 4 THEN '4:00pm - 5:00pm'
                          WHEN T.TIME_HOUR = 5 THEN '5:00pm - 6:00pm'
                          WHEN T.TIME_HOUR = 6 THEN '6:00pm - 7:00pm'
                          WHEN T.TIME_HOUR = 7 THEN '7:00pm - 8:00pm'
                          WHEN T.TIME_HOUR = 8 THEN '8:00pm - 9:00pm'
                          WHEN T.TIME_HOUR = 9 THEN '9:00pm - 10:00pm'
                          WHEN T.TIME_HOUR = 10 THEN '10:00pm - 11:00pm'
                          WHEN T.TIME_HOUR = 11 THEN '11:00pm - 12:00am'
                          ELSE NULL END     
                  ELSE NULL END "CRIME_TIME"
              ,C.OFFENSE_ID "OFFENSE_ID"
          FROM nmoody9899.CRIME C
              JOIN nmoody9899.DATES D
                  ON C.OFFENSE_START_DATE = D.CALENDAR_DATE
              JOIN nmoody9899.TIMES T
                  ON C.OFFENSE_START_TIME_OF_DAY = T.TIME_OF_DAY
      ) CRIME_TIMES  
      WHERE CRIME_TIMES.CRIME_YEAR >= 2008
      GROUP BY CRIME_TIMES.CRIME_YEAR, CRIME_TIMES.CRIME_MONTH, CRIME_TIMES.CRIME_TIME
  ) CRIME_RANKINGS

  ORDER BY 1 ASC`,
        //   WHERE CRIME_RANKINGS.RANKING <= 5

  // CRIME
  AverageDuration: `SELECT
  LENGTHIEST_CRIMES.YEAR "Year"
  ,LENGTHIEST_CRIMES.MONTH "Month"
  ,LENGTHIEST_CRIMES.OFFENSE "Offense"
  ,ROUND(LENGTHIEST_CRIMES.AVERAGE, 3) "Average Length (Days)"
FROM (
  SELECT
      OFFENSE_TIMES.YEAR "YEAR"
      ,OFFENSE_TIMES.MONTH "MONTH"
      ,OFFENSE_TIMES.OFFENSE "OFFENSE"
      ,AVG(
          OFFENSE_TIMES.DAY_DIFFERENCE +
          (CASE WHEN OFFENSE_TIMES.HOUR_DIFFERENCE < 0 THEN 24 - OFFENSE_TIMES.HOUR_DIFFERENCE
              ELSE OFFENSE_TIMES.HOUR_DIFFERENCE END / 24) +
          (CASE WHEN OFFENSE_TIMES.MINUTE_DIFFERENCE < 0 THEN 60 - OFFENSE_TIMES.MINUTE_DIFFERENCE
              ELSE OFFENSE_TIMES.MINUTE_DIFFERENCE END / 1440)
      ) "AVERAGE"
      ,RANK() OVER (PARTITION BY OFFENSE_TIMES.YEAR, OFFENSE_TIMES.MONTH
          ORDER BY AVG(
              OFFENSE_TIMES.DAY_DIFFERENCE +
              (CASE WHEN OFFENSE_TIMES.HOUR_DIFFERENCE < 0 THEN 24 - OFFENSE_TIMES.HOUR_DIFFERENCE
                  ELSE OFFENSE_TIMES.HOUR_DIFFERENCE END / 24) +
              (CASE WHEN OFFENSE_TIMES.MINUTE_DIFFERENCE < 0 THEN 60 - OFFENSE_TIMES.MINUTE_DIFFERENCE
                  ELSE OFFENSE_TIMES.MINUTE_DIFFERENCE END / 1440)
          ) DESC) "RANKING"
  FROM (
      SELECT
          START_D.YEAR "YEAR"
          ,START_D.MONTH_NAME "MONTH"
          ,O.OFFENSE_NAME "OFFENSE"
          ,C.OFFENSE_END_DATE - C.OFFENSE_START_DATE "DAY_DIFFERENCE"
          ,CASE
              WHEN END_T.TIME_HOUR = 12 AND END_T.AM_OR_PM = 'AM' THEN 0
              WHEN END_T.TIME_HOUR <> 12 AND END_T.AM_OR_PM = 'PM' THEN END_T.TIME_HOUR + 12
              ELSE END_T.TIME_HOUR END 
           -
           CASE
              WHEN START_T.TIME_HOUR = 12 AND START_T.AM_OR_PM = 'AM' THEN 0
              WHEN START_T.TIME_HOUR <> 12 AND START_T.AM_OR_PM = 'PM' THEN START_T.TIME_HOUR + 12
              ELSE START_T.TIME_HOUR END
             "HOUR_DIFFERENCE"
          ,END_T.TIME_MINUTE - START_T.TIME_MINUTE "MINUTE_DIFFERENCE"
      FROM nmoody9899.CRIME C
          JOIN nmoody9899.DATES START_D
              ON C.OFFENSE_START_DATE = START_D.CALENDAR_DATE
          JOIN nmoody9899.TIMES START_T
              ON C.OFFENSE_START_TIME_OF_DAY = START_T.TIME_OF_DAY
          JOIN nmoody9899.TIMES END_T
              ON C.OFFENSE_END_TIME_OF_DAY = END_T.TIME_OF_DAY
          JOIN nmoody9899.OFFENSE O
              ON C.OFFENSE_CODE = O.OFFENSE_CODE
      WHERE C.OFFENSE_END_DATE IS NOT NULL
          AND START_D.YEAR >= 2008
  ) OFFENSE_TIMES
  GROUP BY OFFENSE_TIMES.YEAR, OFFENSE_TIMES.MONTH, OFFENSE_TIMES.OFFENSE
) LENGTHIEST_CRIMES
WHERE LENGTHIEST_CRIMES.RANKING <= 5`,

  CountDuration: `SELECT
  LENGTHIEST_CRIMES.YEAR "Year"
  ,LENGTHIEST_CRIMES.MONTH "Month"
  ,LENGTHIEST_CRIMES.OFFENSE "Offense"
  ,CRIME_COUNT "Number of Crimes"
FROM (
  SELECT
      OFFENSE_TIMES.YEAR "YEAR"
      ,OFFENSE_TIMES.MONTH "MONTH"
      ,OFFENSE_TIMES.OFFENSE "OFFENSE"
	  ,COUNT(OFFENSE_TIMES.REPORT_NUMBER) "CRIME_COUNT"
      ,AVG(
          OFFENSE_TIMES.DAY_DIFFERENCE +
          (CASE WHEN OFFENSE_TIMES.HOUR_DIFFERENCE < 0 THEN 24 - OFFENSE_TIMES.HOUR_DIFFERENCE
              ELSE OFFENSE_TIMES.HOUR_DIFFERENCE END / 24) +
          (CASE WHEN OFFENSE_TIMES.MINUTE_DIFFERENCE < 0 THEN 60 - OFFENSE_TIMES.MINUTE_DIFFERENCE
              ELSE OFFENSE_TIMES.MINUTE_DIFFERENCE END / 1440)
      ) "AVERAGE"
      ,RANK() OVER (PARTITION BY OFFENSE_TIMES.YEAR, OFFENSE_TIMES.MONTH
          ORDER BY AVG(
              OFFENSE_TIMES.DAY_DIFFERENCE +
              (CASE WHEN OFFENSE_TIMES.HOUR_DIFFERENCE < 0 THEN 24 - OFFENSE_TIMES.HOUR_DIFFERENCE
                  ELSE OFFENSE_TIMES.HOUR_DIFFERENCE END / 24) +
              (CASE WHEN OFFENSE_TIMES.MINUTE_DIFFERENCE < 0 THEN 60 - OFFENSE_TIMES.MINUTE_DIFFERENCE
                  ELSE OFFENSE_TIMES.MINUTE_DIFFERENCE END / 1440)
          ) DESC) "RANKING"
  FROM (
      SELECT
          START_D.YEAR "YEAR"
          ,START_D.MONTH_NAME "MONTH"
          ,O.OFFENSE_NAME "OFFENSE"
		  ,C.REPORT_NUMBER "REPORT_NUMBER"
          ,C.OFFENSE_END_DATE - C.OFFENSE_START_DATE "DAY_DIFFERENCE"
          ,CASE
              WHEN END_T.TIME_HOUR = 12 AND END_T.AM_OR_PM = 'AM' THEN 0
              WHEN END_T.TIME_HOUR <> 12 AND END_T.AM_OR_PM = 'PM' THEN END_T.TIME_HOUR + 12
              ELSE END_T.TIME_HOUR END 
           -
           CASE
              WHEN START_T.TIME_HOUR = 12 AND START_T.AM_OR_PM = 'AM' THEN 0
              WHEN START_T.TIME_HOUR <> 12 AND START_T.AM_OR_PM = 'PM' THEN START_T.TIME_HOUR + 12
              ELSE START_T.TIME_HOUR END
             "HOUR_DIFFERENCE"
          ,END_T.TIME_MINUTE - START_T.TIME_MINUTE "MINUTE_DIFFERENCE"
      FROM nmoody9899.CRIME C
          JOIN nmoody9899.DATES START_D
              ON C.OFFENSE_START_DATE = START_D.CALENDAR_DATE
          JOIN nmoody9899.TIMES START_T
              ON C.OFFENSE_START_TIME_OF_DAY = START_T.TIME_OF_DAY
          JOIN nmoody9899.TIMES END_T
              ON C.OFFENSE_END_TIME_OF_DAY = END_T.TIME_OF_DAY
          JOIN nmoody9899.OFFENSE O
              ON C.OFFENSE_CODE = O.OFFENSE_CODE
      WHERE C.OFFENSE_END_DATE IS NOT NULL
          AND START_D.YEAR >= 2008
  ) OFFENSE_TIMES
  GROUP BY OFFENSE_TIMES.YEAR, OFFENSE_TIMES.MONTH, OFFENSE_TIMES.OFFENSE
) LENGTHIEST_CRIMES
WHERE LENGTHIEST_CRIMES.RANKING <= 5`,

  // PRECINCT
  Precinct: `SELECT
  HIGHEST_CRIMES.CRIME_YEAR "Year"
  ,HIGHEST_CRIMES.CRIME_MONTH "Month"
  ,HIGHEST_CRIMES.PRECINCT "Precinct"
  ,HIGHEST_CRIMES.SECTOR "Sector"
  ,HIGHEST_CRIMES.BEAT "Beat"
  ,HIGHEST_CRIMES.MCPP "MCPP"
  ,HIGHEST_CRIMES.OFFENSE_COUNT "Number of Offenses"
FROM (
  SELECT
      LOCATION_CRIME.CRIME_YEAR "CRIME_YEAR"
      ,LOCATION_CRIME.CRIME_MONTH "CRIME_MONTH"
      ,LOCATION_CRIME.CRIME_PRECINCT "PRECINCT"
      ,LOCATION_CRIME.CRIME_SECTOR "SECTOR"
      ,LOCATION_CRIME.CRIME_BEAT "BEAT"
      ,LOCATION_CRIME.CRIME_MCPP "MCPP"
      ,COUNT(LOCATION_CRIME.CRIME_OFFENSE) "OFFENSE_COUNT"
      ,RANK() OVER (PARTITION BY 
          LOCATION_CRIME.CRIME_YEAR, LOCATION_CRIME.CRIME_MONTH
          ORDER BY COUNT(LOCATION_CRIME.CRIME_OFFENSE) DESC
      ) "RANKING"
  FROM (
      SELECT 
          D.YEAR "CRIME_YEAR"
          ,D.MONTH_NAME "CRIME_MONTH"
          ,C.PRECINCT "CRIME_PRECINCT"
          ,C.SECTOR "CRIME_SECTOR"
          ,C.BEAT "CRIME_BEAT"
          ,C.MCPP "CRIME_MCPP"
          ,O.OFFENSE_NAME "CRIME_OFFENSE"
      FROM nmoody9899.CRIME C
          JOIN nmoody9899.DATES D
              ON C.OFFENSE_START_DATE = D.CALENDAR_DATE
          JOIN nmoody9899.OFFENSE O
              ON C.OFFENSE_CODE = O.OFFENSE_CODE
      WHERE D.YEAR >= 2008
  ) LOCATION_CRIME
  GROUP BY LOCATION_CRIME.CRIME_YEAR, LOCATION_CRIME.CRIME_MONTH, 
      LOCATION_CRIME.CRIME_PRECINCT, LOCATION_CRIME.CRIME_SECTOR,
      LOCATION_CRIME.CRIME_BEAT, LOCATION_CRIME.CRIME_MCPP
) HIGHEST_CRIMES
WHERE HIGHEST_CRIMES.RANKING <= 5`,
};
