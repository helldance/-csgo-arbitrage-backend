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
    }, 200); // Small delay ensures the table exists
});

// Function to Load Dummy Channels
function loadDummyChannels() {
    let tableBody = document.getElementById("channel-table-body");
    if (!tableBody) {
        console.error("❌ Table body is still not found!");
        return;
    }

    console.log("✅ Inserting dummy rows into table...");
    let dummyData = [
        { name: "Adyen", id: "CH-001", entity: "Adyen Ltd.", status: "Live" },
        { name: "Checkout", id: "CH-002", entity: "Checkout.com", status: "Inactive" },
        { name: "Stripe", id: "CH-003", entity: "Stripe Inc.", status: "Live" },
        { name: "Worldpay", id: "CH-004", entity: "Worldpay Ltd.", status: "Live" },
        { name: "PayPal", id: "CH-005", entity: "PayPal Holdings", status: "Inactive" },
        { name: "Square", id: "CH-006", entity: "Square Inc.", status: "Live" },
        { name: "WePay", id: "CH-007", entity: "WePay LLC", status: "Inactive" },
        { name: "Skrill", id: "CH-008", entity: "Skrill Ltd.", status: "Live" },
        { name: "Neteller", id: "CH-009", entity: "Neteller Ltd.", status: "Inactive" },
        { name: "Rapyd", id: "CH-010", entity: "Rapyd Ltd.", status: "Live" }
    ];

    dummyData.forEach(channel => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${channel.name}</td>
            <td>${channel.id}</td>
            <td>${channel.entity}</td>
            <td>${channel.status === "Live" ? '<span style="color: green;">Live</span>' : '<span style="color: red;">Inactive</span>'}</td>
        `;
        tableBody.appendChild(row);
    });

    console.log("✅ Dummy data loaded successfully!");
}
