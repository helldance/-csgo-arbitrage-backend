document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ channel.js is loaded and executing!");

    setTimeout(() => {
        let tableBody = document.getElementById("channel-table-body");
        if (!tableBody) {
            console.error("❌ Table body NOT FOUND in DOM!");
            return;
        }

        console.log("📌 Table body found, inserting dummy data...");
        loadDummyChannels();
    }, 200);
});

function loadDummyChannels() {
    let tableBody = document.getElementById("channel-table-body");
    if (!tableBody) {
        console.error("❌ Table body is still not found!");
        return;
    }

    console.log("✅ Inserting dummy rows into table...");
    let dummyData = [
        { name: "Adyen", id: "adyen_in_hk", entity: "Adyen Ltd.", status: "Live", country: "US" },
        { name: "Checkout", id: "checkout_in_uk", entity: "Checkout.com", status: "Inactive", country: "UK" },
        { name: "Stripe", id: "stripe_in_us", entity: "Stripe Inc.", status: "Live", country: "US" },
        { name: "Worldpay", id: "worldpay_out_us", entity: "Worldpay Ltd.", status: "Live", country: "UK" },
        { name: "PayPal", id: "paypal_out_us", entity: "PayPal Holdings", status: "Inactive", country: "US" }
    ];

    dummyData.forEach(channel => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${channel.name}</td>
            <td>${channel.id}</td>
            <td>${channel.entity}</td>
            <td>${channel.country}</td>
            <td>${channel.status === "Live" ? '<span style="color: green;">Live</span>' : '<span style="color: red;">Inactive</span>'}</td>
            <td>
                <button class="btn blue lighten-1 waves-effect waves-light" onclick="viewChannel('${channel.id}')">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    function createChannel() {
        const name = document.getElementById("new-channel-name").value;
        const id = document.getElementById("new-channel-id").value;
        const entity = document.getElementById("new-channel-entity").value;
        const status = document.getElementById("new-channel-status").value;
        const country = document.getElementById("new-channel-country").value;
      
        if (!name || !id || !entity || !status || !country) {
          alert("❌ Please fill in all fields before creating a channel.");
          return;
        }
      
        const tableBody = document.getElementById("channel-table-body");
      
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${name}</td>
          <td>${id}</td>
          <td>${entity}</td>
          <td class="${status === 'Live' ? 'green-text' : 'red-text'}">${status}</td>
          <td>${country}</td>
          <td>
            <button class="btn blue lighten-1 waves-effect waves-light" onclick="viewChannel('${id}')">View</button>
          </td>
        `;
      
        tableBody.appendChild(row);
      
        console.log(`✅ Channel Created: ${name} | ${id} | ${entity} | ${status} | ${country}`);
        
        // Close Modal After Creation
        const modal = M.Modal.getInstance(document.getElementById("create-channel-modal"));
        modal.close();
      }
      

    console.log("✅ Dummy data loaded successfully!");
}
