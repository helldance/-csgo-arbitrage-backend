document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ app.js loaded and running!");

  // Attach event listener to all menu links
  document.querySelectorAll(".menu-link").forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default anchor behavior
          let page = this.getAttribute("data-page");

          if (page) {
              loadPage(page);
              history.pushState({ page: page }, "", `/${page}.html`); // Update URL
          }
      });
  });

  // Handle back/forward navigation
  window.addEventListener("popstate", function (event) {
      if (event.state && event.state.page) {
          loadPage(event.state.page);
      }
  });

  // Detect if "channel.html" is the active page
  if (window.location.pathname.includes("channel.html")) {
      console.log("✅ Channel page detected, loading channel.js...");
      loadChannelScript();
  }
});

function loadPage(page) {
  console.log(`📄 Loading page: ${page}`);

  fetch(`pages/${page}.html`)
      .then(response => response.text())
      .then(html => {
          document.getElementById("main-content").innerHTML = html;

          // Ensure script runs AFTER the page is inserted
          if (page === "channel") {
              console.log("📌 Executing channel.js...");
              setTimeout(() => {
                  loadChannelScript();
              }, 200);
          }
      })
      .catch(error => console.error("❌ Error loading page:", error));
}



function loadChannelScript() {
  let script = document.createElement("script");
  script.src = "js/channel.js";
  script.defer = true;
  script.onload = () => {
      console.log("✅ channel.js loaded successfully!");
  };
  document.body.appendChild(script);
}
