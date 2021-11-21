module.exports = {
  //Crimes by Quadrants of longitude/latitude
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
  quadrants.quadrant;`,

  //100 blocks with the most crime by year/month
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
                    FROM CRIME C 
                        JOIN DATES D
                            ON C.OFFENSE_START_DATE = D.CALENDAR_DATE
                    WHERE D.YEAR >= 2008
                        AND C.ONE_HUNDRED_BLOCK_ADDRESS IS NOT NULL
                ) ADDRESSES
                GROUP BY ADDRESSES.CRIME_YEAR, ADDRESSES.CRIME_MONTH, ADDRESSES.ADDRESS
            ) HIGHEST_CRIMES
            WHERE HIGHEST_CRIMES.RANKING <= 5;`,

  // Dates
  CrimeDates: `SELECT 
    CAST(SUBSTR(DATES, 0, 10) AS DATE) "CALENDAR_DATE"
    ,CAST(SUBSTR(DATES, 7, 4) AS INT) "YEAR"
    ,CAST(SUBSTR(DATES, 0, 2) AS INT) "MONTH"
    ,CASE
        WHEN SUBSTR(DATES, 0, 2) = '01' THEN 'JANUARY'
        WHEN SUBSTR(DATES, 0, 2) = '02' THEN 'FEBRUARY'
        WHEN SUBSTR(DATES, 0, 2) = '03' THEN 'MARCH'
        WHEN SUBSTR(DATES, 0, 2) = '04' THEN 'APRIL'
        WHEN SUBSTR(DATES, 0, 2) = '05' THEN 'MAY'
        WHEN SUBSTR(DATES, 0, 2) = '06' THEN 'JUNE'
        WHEN SUBSTR(DATES, 0, 2) = '07' THEN 'JULY'
        WHEN SUBSTR(DATES, 0, 2) = '08' THEN 'AUGUST'
        WHEN SUBSTR(DATES, 0, 2) = '09' THEN 'SEPTEMBER'
        WHEN SUBSTR(DATES, 0, 2) = '10' THEN 'OCTOBER'
        WHEN SUBSTR(DATES, 0, 2) = '11' THEN 'NOVEMBER'
        WHEN SUBSTR(DATES, 0, 2) = '12' THEN 'DECEMBER'
            ELSE NULL END "MONTH_NAME"
    ,CAST(SUBSTR(DATES, 4, 2) AS INT) "DAY"
    ,TO_CHAR(CAST(SUBSTR(DATES, 0, 10) AS DATE), 'DAY') "DAY_NAME"
FROM (
    SELECT DISTINCT CAST(SUBSTR(OFFENSE_START_DATETIME, 0, 10) AS DATE) "DATES"
    FROM CRIME_STAGE
    WHERE OFFENSE_START_DATETIME IS NOT NULL
    UNION
    SELECT DISTINCT CAST(SUBSTR(OFFENSE_END_DATETIME, 0, 10) AS DATE) "DATES"
    FROM CRIME_STAGE
    WHERE OFFENSE_END_DATETIME IS NOT NULL
    UNION
    SELECT DISTINCT CAST(SUBSTR(REPORT_DATETIME, 0, 10) AS DATE) "DATES"
    FROM CRIME_STAGE
    WHERE REPORT_DATETIME IS NOT NULL
) DATES
ORDER BY 
    CAST(SUBSTR(DATES, 7, 4) AS INT) ASC
    ,CAST(SUBSTR(DATES, 0, 2) AS INT) ASC
    ,CAST(SUBSTR(DATES, 4, 2) AS INT) ASC;`,

  // OFFENSE
  Offense: `SELECT DISTINCT OFFENSE_CODE, OFFENSE_NAME, OFFENSE_PARENT_GROUP, 
            OFFENSE_GROUP, CRIME_AGAINST_CATEGORY
            FROM CRIME_STAGE
            GROUP BY OFFENSE_CODE, OFFENSE_NAME, OFFENSE_PARENT_GROUP, 
                OFFENSE_GROUP, CRIME_AGAINST_CATEGORY
            ORDER BY 1 ASC;`,

  // AVERAGE TIME OF DAY
  CrimeTimeOfDay: `SELECT 
    TIMES "TIME_OF_DAY"
    ,CAST(SUBSTR(TIMES, 0, 8) AS TIMESTAMP) "TIME_OF_DAY_AS_TIME"
    ,CAST(SUBSTR(TIMES, 0, 2) AS INT) "TIME_HOUR"
    ,CAST(SUBSTR(TIMES, 4, 2) AS INT) "TIME_MINUTE"
    ,CAST(SUBSTR(TIMES, 7, 2) AS INT) "TIME_SECOND"
    ,SUBSTR(TIMES, -2) "AM_OR_PM"
FROM (
    SELECT DISTINCT SUBSTR(OFFENSE_START_DATETIME, -11) "TIMES"
    FROM CRIME_STAGE
    WHERE OFFENSE_START_DATETIME IS NOT NULL
    UNION
    SELECT DISTINCT SUBSTR(OFFENSE_END_DATETIME, -11) "TIMES"
    FROM CRIME_STAGE
    WHERE OFFENSE_END_DATETIME IS NOT NULL
    UNION
    SELECT DISTINCT SUBSTR(REPORT_DATETIME, -11) "TIMES"
    FROM CRIME_STAGE
    WHERE REPORT_DATETIME IS NOT NULL
) TIMES
ORDER BY
    SUBSTR(TIMES, -2) ASC
    ,CAST(SUBSTR(TIMES, 0, 2) AS INT) ASC
    ,CAST(SUBSTR(TIMES, 4, 2) AS INT) ASC
    ,CAST(SUBSTR(TIMES, 7, 2) AS INT) ASC;`,

  // CRIME
  CrimeDuration: `SELECT
    REPORT_NUMBER
    ,OFFENSE_ID
    ,CAST(SUBSTR(OFFENSE_START_DATETIME, 0, 10) AS DATE) OFFENSE_START_DATE
    ,SUBSTR(OFFENSE_START_DATETIME, -11) OFFENSE_START_TIME_OF_DAY
    ,CAST(SUBSTR(OFFENSE_END_DATETIME, 0, 10) AS DATE) OFFENSE_END_DATE
    ,SUBSTR(OFFENSE_END_DATETIME, -11) OFFENSE_END_TIME_OF_DAY
    ,CAST(SUBSTR(REPORT_DATETIME, 0, 10) AS DATE) REPORT_DATE
    ,SUBSTR(REPORT_DATETIME, -11) REPORT_TIME_OF_DAY   
    ,OFFENSE_CODE
    ,ONE_HUNDRED_BLOCK_ADDRESS
    ,LONGITUDE
    ,LATITUDE
    ,PRECINCT
    ,SECTOR
    ,BEAT
    ,MCPP
FROM CRIME_STAGE;`,
};
