document.addEventListener("DOMContentLoaded", function () {
    M.AutoInit();
    loadDummyRoutingRules();
});

// Dummy Routing Rules Data
function loadDummyRoutingRules() {
    const tableBody = document.getElementById("routing-rules-table");
    const dummyData = [
        { ruleId: "R001", merchantId: "M001", paymentCategory: "Card", country: "US", currency: "USD" },
        { ruleId: "R002", merchantId: "M002", paymentCategory: "Wallet", country: "UK", currency: "GBP" },
        { ruleId: "R003", merchantId: "M003", paymentCategory: "Crypto", country: "JP", currency: "JPY" },
        { ruleId: "R004", merchantId: "M004", paymentCategory: "BNPL", country: "FR", currency: "EUR" }
    ];

    dummyData.forEach(rule => {
        const row = `
            <tr>
                <td>${rule.ruleId}</td>
                <td>${rule.merchantId}</td>
                <td>${rule.paymentCategory}</td>
                <td>${rule.country}</td>
                <td>${rule.currency}</td>
                <td><button class="btn-small blue" onclick="viewRule('${rule.ruleId}')">View</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Function to Search Routing Rules
function searchRoutingRules() {
    console.log("Searching routing rules...");
}

// Function to Create New Routing Rule
function createRoutingRule() {
    const ruleId = document.getElementById("new-rule-id").value;
    const merchantId = document.getElementById("new-merchant-id").value;
    const paymentCategory = document.getElementById("new-payment-category").value;
    const country = document.getElementById("new-country").value;
    const currency = document.getElementById("new-currency").value;
    const weightedChannels = document.getElementById("new-weighted-channels").value;

    console.log("Creating rule:", { ruleId, merchantId, paymentCategory, country, currency, weightedChannels });
}


// Dummy Data for Routing Rules
const routingRules = [
    {
        ruleId: "R001",
        merchantId: "M001",
        paymentCategory: "Card",
        country: "US",
        currency: "USD",
        weightedChannels: [{ channel: "Adyen", weight: 70 }, { channel: "Checkout", weight: 30 }]
    },
    {
        ruleId: "R002",
        merchantId: "M002",
        paymentCategory: "Wallet",
        country: "UK",
        currency: "GBP",
        weightedChannels: [{ channel: "Stripe", weight: 50 }, { channel: "PayPal", weight: 50 }]
    }
];

function viewRule(ruleId) {
    const rule = routingRules.find(r => r.ruleId === ruleId);
    if (!rule) {
        alert("Rule not found!");
        return;
    }

    document.getElementById("drawer-rule-id").textContent = `Rule ID: ${rule.ruleId}`;

    const conditionsList = document.getElementById("drawer-conditions");
    conditionsList.innerHTML = `
        <li><strong>Merchant ID:</strong> ${rule.merchantId}</li>
        <li><strong>Payment Category:</strong> ${rule.paymentCategory}</li>
        <li><strong>Country:</strong> ${rule.country}</li>
        <li><strong>Currency:</strong> ${rule.currency}</li>
    `;

    const weightedList = document.getElementById("drawer-weighted-channels");
    weightedList.innerHTML = rule.weightedChannels
        .map(wc => `<li><strong>${wc.channel}:</strong> ${wc.weight}%</li>`)
        .join("");

    document.getElementById("rule-details-drawer").classList.add("open");

    // Chart.js Implementation
    const ctx = document.getElementById("channelChart").getContext("2d");
    
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: rule.weightedChannels.map(wc => wc.channel),
            datasets: [{
                data: rule.weightedChannels.map(wc => wc.weight),
                backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// Function to Close the Drawer
function closeDrawer() {
    document.getElementById("rule-details-drawer").classList.remove("open");
}

// Function to Edit Rule (Placeholder)
function editRule() {
    alert("Edit functionality will be implemented!");
}

function renderChannelChart(data) {
    const ctx = document.getElementById('channelChart').getContext('2d');
    
    // Destroy existing chart instance if it exists
    if (window.channelChartInstance) {
        window.channelChartInstance.destroy();
    }

    // Extracting channel names and weights
    const labels = data.map(channel => channel.name);
    const values = data.map(channel => channel.weight);

    window.channelChartInstance = new Chart(ctx, {
        type: 'bar', // Use bar chart instead of pie
        data: {
            labels: labels,
            datasets: [{
                label: 'Weight Distribution',
                data: values,
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63'], // Assign colors
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // This makes it a horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100, // Set max to 100% for better visualization
                    title: {
                        display: true,
                        text: 'Weight (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}



