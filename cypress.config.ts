import { defineConfig } from "cypress";
import { gmailTasks } from "./cypress/plugins/gmailPlugin";

export default defineConfig({
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    video: true,
    baseUrl: "https://mafid-sit.progressive.majidalfuttaim.com/landing/client/",
    "watchForFileChanges": false,
    "defaultCommandTimeout": 5000,
    "pageLoadTimeout": 120000, // Increased to 120 seconds (2 minutes)
    "reporter": "mochawesome",
    "reporterOptions": {
        "charts": true,
        "overwrite": false,
        "html": true,
        "json": true,
        "reportDir": "cypress/reports/html",
        "reportFilename": "[status]_[datetime]-[name]-report",
        "timestamp": "yyyy_mm_dd_HH_MM_ss",
        "embeddedScreenshots": true,
        "inlineAssets": true
       },
       
       "env": {
        "ENV": "Prod"
      },
      
      setupNodeEvents(on, config) {
        // Gmail API tasks
        on('task', {
          ...gmailTasks,
        });

        return config;
      }
    }
});