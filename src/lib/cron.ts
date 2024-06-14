import cron from "node-cron"

export const task = cron.schedule(
  "*/15 * * * *",
  () => {
    console.log("Pinging server...")
    const url = "https://yc-server8080.onrender.com/ping"
    fetch(url)
      .then(response => response.text())
      .then(text => console.log(`Server responded: ${text}`))
      .catch(error => console.error("Error pinging server:", error))
  },
  {
    scheduled: false,
  }
)
