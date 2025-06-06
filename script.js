// 1. Load data from Open Charge Map API
fetch('https://api.openchargemap.io/v3/poi/?output=json&countrycode=DE&maxresults=10&key=0502dd5e-0f23-40ed-b3dd-466dc6470e48')
  .then(response => response.json())
  .then(data => {
    displayStations(data);
    updateTimestamp();
  })
  .catch(error => {
    console.error('Error fetching data from OCM API:', error);
  });

// 2. Update the last-updated timestamp
function updateTimestamp() {
  const timestamp = new Date().toLocaleString();
  document.getElementById('last-updated').textContent = `Last updated: ${timestamp}`;
}

// 3. Display all charging stations in table rows
function displayStations(stations) {
  const tbody = document.querySelector('#station-table tbody');
  tbody.innerHTML = ''; // clear previous content

  stations.forEach(station => {
    const row = document.createElement('tr');

    const name = `<td><i class="fas fa-charging-station"></i> ${station.AddressInfo?.Title || 'Unknown Station'}</td>`;
    const location = `<td><i class="fas fa-map-marker-alt"></i> ${station.AddressInfo?.AddressLine1 || ''}, ${station.AddressInfo?.Town || ''}, ${station.AddressInfo?.Country?.Title || ''}</td>`;
    const price = `<td><i class="fas fa-euro-sign"></i> ${station.UsageCost != null ? station.UsageCost : 'Not available'}</td>`;
    const speed = `<td><i class="fas fa-bolt"></i> ${station.Connections?.[0]?.PowerKW != null ? station.Connections[0].PowerKW + ' kW' : 'N/A'}</td>`;
    const plug = `<td><i class="fas fa-plug"></i> ${station.Connections?.[0]?.ConnectionType?.Title || 'N/A'}</td>`;
    const access = `<td><i class="fas fa-unlock"></i> ${station.UsageType?.Title || 'N/A'}</td>`;

    const statusTitle = station.StatusType?.Title || 'Unknown';
    const statusClass = getStatusBadgeClass(statusTitle);
    const status = `<td><i class="fas fa-circle"></i> <span class="badge ${statusClass}">${statusTitle}</span></td>`;

    row.innerHTML = name + location + price + speed + plug + access + status;
    tbody.appendChild(row);
  });
}

// 4. Define badge colors for status
function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'available':
      return 'badge--green';
    case 'operational':
      return 'badge--blue';
    case 'out of service':
      return 'badge--red';
    default:
      return 'badge--gray';
  }
}
// 5. Filter function based on user input
document.getElementById('filter-input').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const rows = document.querySelectorAll('#station-table tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
});



