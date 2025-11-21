const MapManager = {
    map: null,
    markersLayer: null,
    
    initialize(containerId) {
        this.map = L.map(containerId).setView(
            CONFIG.MAP_CONFIG.center, 
            CONFIG.MAP_CONFIG.zoom
        );
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            minZoom: CONFIG.MAP_CONFIG.minZoom,
            maxZoom: CONFIG.MAP_CONFIG.maxZoom
        }).addTo(this.map);
        
        this.markersLayer = L.layerGroup().addTo(this.map);
        
        return this.map;
    },
    
    clearMarkers() {
        if (this.markersLayer) {
            this.markersLayer.clearLayers();
        }
    },
    
    addMarker(lat, lng, popupContent, color) {
        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        marker.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'custom-popup'
        });
        
        marker.addTo(this.markersLayer);
        
        return marker;
    },
    
    fitBounds(data) {
        const validCoords = data
            .filter(d => d.Latitude && d.Longitude)
            .map(d => [parseFloat(d.Latitude), parseFloat(d.Longitude)]);
        
        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
};
