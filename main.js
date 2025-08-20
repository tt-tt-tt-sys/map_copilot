let map = L.map('map').setView([-25.2744, 133.7751], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

let storeLocations = {
  "Trek Bicycle Ashmore": [-27.9859506, 153.3629333],
  "Trek Bicycle Belmont": [-31.9527545, 115.9168093],
  "Trek Bicycle Bennetts Green": [-32.9970236, 151.6866114],
  "Trek Bicycle Brunswick East": [-37.7656948, 144.973011],
  "Trek Bicycle Burleigh Heads": [-28.1133664, 153.4406943],
  "Trek Bicycle Camberwell": [-37.831101, 145.055927],
  "Trek Bicycle Cannington": [-32.0157217, 115.9287012],
  "Trek Bicycle Carindale": [-27.5198367, 153.1125044],
  "Trek Bicycle Carnegie": [-37.8841841, 145.0561854],
  "Trek Bicycle Claremont": [-31.9816566, 115.7908936],
  "Trek Bicycle Coburg": [-37.7322735, 144.9592024],
  "Trek Bicycle Essendon": [-37.7374489, 144.8931367],
  "Trek Bicycle Fyshwick": [-35.3253794, 149.1706314],
  "Trek Bicycle Gabba": [-27.4956759, 153.0353622],
  "Trek Bicycle Hoppers Crossing": [-37.8753321, 144.7174409],
  "Trek Bicycle Ipswich": [-27.6130794, 152.7812615],
  "Trek Bicycle Joondalup": [-31.7584954, 115.7711846],
  "Trek Bicycle Kawana": [-26.6995903, 153.1194911],
  "Trek Bicycle Knox": [-37.8696283, 145.2408593],
  "Trek Bicycle Majura Park": [-35.2951379, 149.1903072],
  "Trek Bicycle Maribyrnong": [-37.7737654, 144.8896643],
  "Trek Bicycle Melbourne QV": [-37.810586, 144.9668548],
  "Trek Bicycle Myaree": [-32.046465, 115.8590304],
  "Trek Bicycle North Lakes": [-27.2396506, 153.0152252],
  "Trek Bicycle Osborne Park": [-31.9023716, 115.8148527],
  "Trek Bicycle Pakenham": [-38.0629625, 145.454414],
  "Trek Bicycle Penrith": [-33.771735, 150.6710035],
  "Trek Bicycle Perth CBD": [-31.951904, 115.852206],
  "Trek Bicycle Phillip": [-35.3495058, 149.089338],
  "Trek Bicycle Richmond": [-37.8199135, 145.0095283],
  "Trek Bicycle Ringwood": [-37.8150393, 145.2282763],
  "Trek Bicycle Rockhampton": [-23.3428492, 150.5214352],
  "Trek Bicycle Rouse Hill": [-33.6917394, 150.9248052],
  "Trek Bicycle Sydney": [-33.8682988, 151.2054611],
  "Trek Bicycle Turramurra": [-33.7337159, 151.1275263],
  "Trek Bicycle Warrawong": [-34.4865225, 150.8860045],
  "Trek Bicycle Whitfords": [-31.798995, 115.7454938],
  "Trek Bicycle Williamstown": [-37.8564675, 144.8978252],
  "Trek Bicycle Windsor": [-27.4373592, 153.0261269],
  "Trek Bicycle Wollongong": [-34.4316712, 150.8920436]
};

let storeMarkers = [];
let selectedStore = "";
let assignments = {};

const storeSelect = document.getElementById("storeSelect");
storeSelect.innerHTML = '<option value="">None</option>';
for (let name in storeLocations) {
  storeSelect.innerHTML += `<option value="${name}">${name}</option>`;
}

storeSelect.addEventListener("change", function () {
  selectedStore = this.value;
  storeMarkers.forEach(m => map.removeLayer(m));
  storeMarkers = [];

  if (storeLocations[selectedStore]) {
    let marker = L.marker(storeLocations[selectedStore])
      .addTo(map)
      .bindPopup(`<b>${selectedStore}</b>`)
      .openPopup();
    storeMarkers.push(marker);
    map.setView(storeLocations[selectedStore], 10);
  }
});

function exportCSV() {
  let rows = [["Store Name", "Postcode", "Suburb"]];
  for (let store in assignments) {
    assignments[store].forEach(entry => {
      rows.push([store, entry.postcode, entry.suburb]);
    });
  }
  let csv = Papa.unparse(rows);
  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", "store_postcode_assignments.csv");
  link.click();
}

// Load postcode data
fetch("postcode_data.json")
  .then(response => response.json())
  .then(postcodeData => {
    postcodeData.forEach(entry => {
      let marker = L.circleMarker([entry.lat, entry.lng], {
        radius: 6,
        color: '#333',
        fillColor: '#ccc',
        fillOpacity: 0.6
      }).addTo(map);

      marker.bindPopup(`<b>${entry.suburb}</b><br>Postcode: ${entry.postcode}`);

      marker.on("click", function () {
        if (!selectedStore) return;
        marker.setStyle({ fillColor: '#0074D9', color: '#0074D9' });
        if (!assignments[selectedStore]) assignments[selectedStore] = [];
        let alreadyAssigned = assignments[selectedStore].some(p => p.postcode === entry.postcode);
        if (!alreadyAssigned) {
          assignments[selectedStore].push(entry);
        }
      });
    });
  });
