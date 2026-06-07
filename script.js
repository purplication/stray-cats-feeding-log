// Replace with your actual Web App URL from Google Apps Script
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzOyW-HXr-OIpoM58oNQ-GJ6zpiYxmkWiKPaY268kudy0WPpi_jT9RzMwO4n4wXPwcUug/exec"; // <-- paste your copied URL here

// Handle form submission
document.getElementById("feedingForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const feederName = document.getElementById("feederName").value;
  const feedingComment = document.getElementById("feedingComment").value;

  if (feederName && feedingComment) {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const feedingEntry = {
      name: feederName,
      comment: feedingComment,
      loggedAt: `${dateString} ${timeString}`
    };

    // Send entry to Google Sheet via Apps Script endpoint
    await fetch(SHEET_URL, {
      method: "POST",
      body: JSON.stringify(feedingEntry),
      headers: { "Content-Type": "application/json" }
    });

    // Reload list from Google Sheet
    loadFeedings();
    document.getElementById("feedingForm").reset();
  }
});

// Fetch entries from Google Sheet
async function loadFeedings() {
  const response = await fetch(SHEET_URL);
  const data = await response.json();

  const list = document.getElementById("feedingList");
  list.innerHTML = "";

  data.forEach(entry => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: "${entry.comment}" (logged: ${entry.loggedAt})`;
    list.appendChild(listItem);
  });
}

// Load feedings when page opens
window.addEventListener("DOMContentLoaded", loadFeedings);