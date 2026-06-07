// Use a proxy to bypass CORS
const PROXY = "https://cors-anywhere.herokuapp.com/";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzOyW-HXr-OIpoM58oNQ-GJ6zpiYxmkWiKPaY268kudy0WPpi_jT9RzMwO4n4wXPwcUug/exec";

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

    // Send entry via proxy
    await fetch(PROXY + SHEET_URL, {
      method: "POST",
      body: JSON.stringify(feedingEntry),
      headers: { "Content-Type": "application/json" }
    });

    loadFeedings();
    document.getElementById("feedingForm").reset();
  }
});

// Fetch entries
async function loadFeedings() {
  const response = await fetch(PROXY + SHEET_URL);
  const data = await response.json();

  const list = document.getElementById("feedingList");
  list.innerHTML = "";

  data.forEach(entry => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: "${entry.comment}" (logged: ${entry.loggedAt})`;
    list.appendChild(listItem);
  });
}

window.addEventListener("DOMContentLoaded", loadFeedings);
