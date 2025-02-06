document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize sidenav
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  });
  
  // Function to load different content pages dynamically
  function loadPage(page) {
    let content = document.getElementById('content');
    
    let pages = {
      'dashboard': '<h4>Dashboard</h4><p>Dashboard content here.</p>',
      'router': '<h4>Router</h4><p>Manage routing configurations.</p>',
      'payment-method': '<h4>Payment Method</h4><p>Available payment methods.</p>',
      'channel': '<h4>Channel</h4><p>Manage payment channels.</p>',
      'transaction': '<h4>Transaction</h4><p>View transaction history.</p>',
      'payment-instrument': '<h4>Payment Instrument</h4><p>Manage stored payment instruments.</p>'
    };
  
    content.innerHTML = pages[page] || '<h4>Page not found</h4>';
  }
  