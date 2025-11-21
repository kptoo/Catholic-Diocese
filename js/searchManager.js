const SearchManager = {
    data: null,
    markersMap: new Map(),
    
    initialize(data, markersMap) {
        this.data = data;
        this.markersMap = markersMap;
        
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }
            
            this.performSearch(query);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#search-panel')) {
                searchResults.classList.remove('active');
            }
        });
    },
    
    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        const lowerQuery = query.toLowerCase();
        
        const results = this.data.filter(diocese => {
            const dioceseName = (diocese.Diocese || '').toLowerCase();
            const country = (diocese.Country || '').toLowerCase();
            const name = (diocese.Name || '').toLowerCase();
            
            return dioceseName.includes(lowerQuery) || 
                   country.includes(lowerQuery) || 
                   name.includes(lowerQuery);
        }).slice(0, 10); // Limit to 10 results
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No dioceses found</div>';
            searchResults.classList.add('active');
            return;
        }
        
        searchResults.innerHTML = results.map(diocese => `
            <div class="search-result-item" data-id="${diocese.ID}">
                <div class="search-result-diocese">${diocese.Diocese || 'Unknown'}</div>
                <div class="search-result-info">${diocese.Country || 'N/A'} • ${diocese.Name || 'N/A'}</div>
            </div>
        `).join('');
        
        searchResults.classList.add('active');
        
        // Add click handlers to results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const dioceseId = item.dataset.id;
                this.focusDiocese(dioceseId);
                searchResults.classList.remove('active');
                document.getElementById('search-input').value = '';
            });
        });
    },
    
    focusDiocese(dioceseId) {
        const diocese = this.data.find(d => d.ID === dioceseId);
        
        if (diocese && diocese.Latitude && diocese.Longitude) {
            const lat = parseFloat(diocese.Latitude);
            const lng = parseFloat(diocese.Longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                MapManager.map.setView([lat, lng], 10, {
                    animate: true,
                    duration: 1
                });
                
                // Find and open the marker popup
                setTimeout(() => {
                    MapManager.markersLayer.eachLayer(layer => {
                        const markerLatLng = layer.getLatLng();
                        if (Math.abs(markerLatLng.lat - lat) < 0.0001 && 
                            Math.abs(markerLatLng.lng - lng) < 0.0001) {
                            layer.openPopup();
                        }
                    });
                }, 500);
            }
        }
    }
};
