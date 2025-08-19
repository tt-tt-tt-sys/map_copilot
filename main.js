
let map = L.map('map').setView([-25.2744, 133.7751], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

let storeColours = {
  "Trek Bicycle Ashmore": "#aacb01",
  "Trek Bicycle Belmont": "#0b13ce",
  "Trek Bicycle Bennetts Green": "#fe0313",
  "Trek Bicycle Brunswick East": "#b364f8",
  "Trek Bicycle Burleigh Heads": "#b38515",
  "Trek Bicycle Camberwell": "#50117f",
  "Trek Bicycle Cannington": "#a335f5",
  "Trek Bicycle Carindale": "#6b2c09",
  "Trek Bicycle Carnegie": "#458900",
  "Trek Bicycle Claremont": "#a05616",
  "Trek Bicycle Coburg": "#4d4f44",
  "Trek Bicycle Essendon": "#28d43c",
  "Trek Bicycle Fyshwick": "#1b1500",
  "Trek Bicycle Gabba": "#f4fcd7",
  "Trek Bicycle Hoppers Crossing": "#fc92fc",
  "Trek Bicycle Ipswich": "#0d597a",
  "Trek Bicycle Joondalup": "#6991c1",
  "Trek Bicycle Kawana": "#485333",
  "Trek Bicycle Knox": "#a8b7c6",
  "Trek Bicycle Majura Park": "#60e186",
  "Trek Bicycle Maribyrnong": "#b1ba1e",
  "Trek Bicycle Melbourne QV": "#c1029a",
  "Trek Bicycle Myaree": "#c0a3af",
  "Trek Bicycle North Lakes": "#8c5e08",
  "Trek Bicycle Osborne Park": "#9ad7e5",
  "Trek Bicycle Pakenham": "#39dcd2",
  "Trek Bicycle Penrith": "#ece10d",
  "Trek Bicycle Perth CBD": "#cbf050",
  "Trek Bicycle Phillip": "#851726",
  "Trek Bicycle Richmond": "#3842ae",
  "Trek Bicycle Ringwood": "#5f4243",
  "Trek Bicycle Rockhampton": "#2d6584",
  "Trek Bicycle Rouse Hill": "#eb547b",
  "Trek Bicycle Sydney": "#258e36",
  "Trek Bicycle Turramurra": "#0f742f",
  "Trek Bicycle Warrawong": "#e517c0",
  "Trek Bicycle Whitfords": "#ccf32e",
  "Trek Bicycle Williamstown": "#a7fb5f",
  "Trek Bicycle Windsor": "#eb9361",
  "Trek Bicycle Wollongong": "#26566c"
};

let assignments = {};
let selectedStore = "";

const storeSelect = document.getElementById("storeSelect");
for (let store in storeColours) {
    let option = document.createElement("option");
    option.value = store;
    option.text = store;
    storeSelect.appendChild(option);
}
storeSelect.addEventListener("change", function() {
    selectedStore = this.value;
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

      marker.on("click", function() {
        if (!selectedStore) return;
        marker.setStyle({ fillColor: storeColours[selectedStore], color: storeColours[selectedStore] });
        if (!assignments[selectedStore]) assignments[selectedStore] = [];
        assignments[selectedStore].push(entry);
      });
    });
  });
