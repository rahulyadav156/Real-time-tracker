const socket = io();

// Leaflet map setup
const map = L.map("map").setView([20.5937, 78.9629], 5); // India center
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © <a href='https://www.openstreetmap.org/'>OSM</a>"
}).addTo(map);

const markers = {}; //

// 🔹 Custom icon 
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: null // 
});

// Geolocation tracking
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      socket.emit("sendLocation", { latitude, longitude });

      if (!markers[socket.id]) {
        map.setView([latitude, longitude], 16);
      }
    },
    (err) => console.log("Error:", err),
    { enableHighAccuracy: true }
  );
}

// Location receive
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(`User: ${id.substring(0, 5)}`) // 👈 optional popup
      .openPopup();
  }
});


socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
