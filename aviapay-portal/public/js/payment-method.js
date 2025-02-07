document.addEventListener("DOMContentLoaded", function () {
    M.AutoInit(); // Initialize Materialize components
    loadDummyPayments();
});

// Dummy Data for Payment Methods
const dummyPayments = [
    { name: "Visa", id: "pm_card_visa", category: "Card", subcategory: "IntlScheme", markets: "Global", direction: "in" },
    { name: "MasterCard", id: "pm_card_mc", category: "Card", subcategory: "IntlScheme", markets: "Global", direction: "in" },
    { name: "SEPA Direct Debit", id: "pm_abp_sepa", category: "ABP", subcategory: "DirectDebit", markets: "EU", direction: "in" },
    { name: "PayPal", id: "pm_wallet_paypal", category: "Wallet", subcategory: "Stage", markets: "US, EU", direction: "in" },
    { name: "Bitcoin", id: "pm_crypto_btc", category: "Crypto", subcategory: "-", markets: "Global", direction: "in" }
];

function loadDummyPayments() {
    const tableBody = document.getElementById("payment-table-body");
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    dummyPayments.forEach(payment => {
        let row = `<tr>
            <td>${payment.name}</td>
            <td>${payment.id}</td>
            <td>${payment.category}</td>
            <td>${payment.subcategory}</td>
            <td>${payment.markets}</td>
            <td>${payment.direction}</td>
            <td>
                <button class="btn-small blue">View</button>
                <button class="btn-small yellow darken-2">Edit</button>
                <button class="btn-small red">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Search Payment Methods
function searchPaymentMethods() {
    let name = document.getElementById("payment-name").value.toLowerCase();
    let id = document.getElementById("payment-id").value.toLowerCase();
    let category = document.getElementById("payment-category").value;

    let filteredPayments = dummyPayments.filter(payment =>
        (!name || payment.name.toLowerCase().includes(name)) &&
        (!id || payment.id.toLowerCase().includes(id)) &&
        (!category || payment.category === category)
    );

    const tableBody = document.getElementById("payment-table-body");
    tableBody.innerHTML = "";

    filteredPayments.forEach(payment => {
        let row = `<tr>
            <td>${payment.name}</td>
            <td>${payment.id}</td>
            <td>${payment.category}</td>
            <td>${payment.subcategory}</td>
            <td>${payment.markets}</td>
            <td>${payment.direction}</td>
            <td>
                <button class="btn-small blue">View</button>
                <button class="btn-small yellow darken-2">Edit</button>
                <button class="btn-small red">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    
}
