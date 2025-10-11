import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    video: true,
    baseUrl: "https://mafid-sit.progressive.majidalfuttaim.com/landing/client/",
    "watchForFileChanges": false,
    "defaultCommandTimeout": 5000,
    "reporter": "mochawesome",
    "reporterOptions": {
        "charts": true,
        "overwrite": false,
        "html": false,
        "json": true,
        "reportDir": "cypress/reports"
       },
       
       "env": {
        "ENV": "Staging"
      }
    }
});   