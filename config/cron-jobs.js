module.exports = {
    /**
     * Check Scheduled Messages
     * Runs every 1 minute.
     */
    // "*/1 * * * *": ({ strapi }) => {
    //   console.log("CRON JOB RUNNING EVERY 1 MINUTE...");
    // },
  
    /**
     * Runs on the first day of every month at (8:00 AM).
     */
    "0 8 1 * *": ({ strapi }) => {
      console.log("CRON JOB RUNNING ON THE FIRST DAY OF EVERY MONTH...");
      // Add your logic here (e.g., monthly report generation, etc.)
      
      // CHECK FOR MONTHLY LEAVES INCREMENTS
    },
  
    /**
     * Runs on the first day of the year at (12:00 AM).
     */
    "0 0 1 1 *": ({ strapi }) => {
      console.log("CRON JOB RUNNING ON THE FIRST DAY OF THE YEAR...");
      // Add your logic here (e.g., yearly report generation, etc.)
      // CHECK FOR YEARLY LEAVES INCREMENTS
      // CREATE YEAR LEAVES BALANCE
    },
  
    /**
     * Runs every day at 8:00 AM.
     */
    "0 8 * * *": ({ strapi }) => {
      console.log("CRON JOB RUNNING EVERY DAY AT 8 AM...");
      // Add your logic here (e.g., sending a morning notification, etc.)

      // CHECK FOR DAILY LEAVES INCREMENTS
      // CHECK FOR EXPIRING DOCUMENTS
      // CHECK FOR PENDING LEAVES/PAYROLL
      // CHECK FOR 
    },
  
    /**
     * Runs every day at midnight (12:00 AM).
     */
    "0 0 * * *": ({ strapi }) => {
      console.log("CRON JOB RUNNING EVERY DAY AT 12 AM...");
      // Add your logic here (e.g., daily database backup, etc.)
    },
  };
  