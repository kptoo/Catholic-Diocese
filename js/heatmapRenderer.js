const HeatmapRenderer = {
    currentStatistic: 'Catholics',
    colorScale: null,
    currentHistoricalData: null,
    
    setStatistic(statistic) {
        this.currentStatistic = statistic;
    },
    
    createColorScale(min, max) {
        this.colorScale = d3.scaleQuantile()
            .domain([min, max])
            .range(CONFIG.HEATMAP_COLORS);
        
        return this.colorScale;
    },
    
    getColor(value) {
        if (!this.colorScale || value === null || value === undefined || 
            value === '' || value === 'NA') {
            return '#cccccc';
        }
        
        const num = parseFloat(value);
        if (isNaN(num)) return '#cccccc';
        
        return this.colorScale(num);
    },
    
    renderLegend(min, max, statistic) {
        const legendDiv = document.getElementById('legend');
        legendDiv.innerHTML = '';
        
        const title = document.createElement('div');
        title.className = 'legend-title';
        title.textContent = CONFIG.STATISTICS[statistic].label;
        legendDiv.appendChild(title);
        
        const scaleDiv = document.createElement('div');
        scaleDiv.className = 'legend-scale';
        
        CONFIG.HEATMAP_COLORS.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.style.backgroundColor = color;
            colorBox.style.flex = '1';
            scaleDiv.appendChild(colorBox);
        });
        
        legendDiv.appendChild(scaleDiv);
        
        const labelsDiv = document.createElement('div');
        labelsDiv.className = 'legend-labels';
        
        const format = CONFIG.STATISTICS[statistic].format;
        const minLabel = document.createElement('span');
        minLabel.textContent = DataProcessor.formatValue(min, format);
        
        const maxLabel = document.createElement('span');
        maxLabel.textContent = DataProcessor.formatValue(max, format);
        
        labelsDiv.appendChild(minLabel);
        labelsDiv.appendChild(maxLabel);
        
        legendDiv.appendChild(labelsDiv);
    },
    
    renderMap(data, dioceseMap, statistic) {
        this.setStatistic(statistic);
        
        MapManager.clearMarkers();
        
        const [min, max] = DataProcessor.getStatisticRange(data, statistic);
        this.createColorScale(min, max);
        this.renderLegend(min, max, statistic);
        
        data.forEach(diocese => {
            const lat = parseFloat(diocese.Latitude);
            const lng = parseFloat(diocese.Longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                const value = diocese[statistic];
                const color = this.getColor(value);
                
                // Use Diocese field as key to get historical data
                const dioceseKey = diocese.Diocese || diocese.ID;
                const historicalData = dioceseMap.get(dioceseKey);
                
                const popupContent = this.createPopupContent(
                    diocese, 
                    statistic, 
                    historicalData
                );
                
                const marker = MapManager.addMarker(lat, lng, popupContent, color);
                
                marker.on('popupopen', (e) => {
                    const popup = e.popup;
                    const popupElement = popup.getElement();
                    
                    // Store diocese info for modal
                    const dioceseInfo = {
                        title: diocese.Diocese || 'Unknown Diocese',
                        country: diocese.Country || 'N/A',
                        statistic: statistic,
                        historicalData: historicalData
                    };
                    
                    // Use setTimeout to ensure DOM is fully ready
                    setTimeout(() => {
                        this.setupModalButton(popupElement, dioceseInfo);
                    }, 50);
                });
            }
        });
    },
    
    setupModalButton(popupElement, dioceseInfo) {
        console.log('setupModalButton called');
        
        // Use event delegation on the popup element
        popupElement.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'open-chart-modal-btn') {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Opening chart modal');
                ChartModal.open(dioceseInfo);
            }
        }, { once: false });
        
        console.log('Modal button handler set up');
    },
    
    getSelectedChartStatistics() {
        const checkboxes = document.querySelectorAll('#statistic-panel input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    },
    
    createPopupContent(diocese, statistic, historicalData) {
        const format = CONFIG.STATISTICS[statistic].format;
        const value = DataProcessor.formatValue(diocese[statistic], format);
        
        // Use Diocese field as the title
        const dioceseTitle = diocese.Diocese || 'Unknown Diocese';
        const dioceseName = diocese.Name || 'N/A';
        const country = diocese.Country || 'N/A';
        
        const hasHistoricalData = historicalData && historicalData.length > 1;
        
        return `
            <div class="popup-header">${dioceseTitle}</div>
            <div class="popup-stat">
                <span class="popup-stat-label">Country:</span>
                <span class="popup-stat-value">${country}</span>
            </div>
            <div class="popup-stat">
                <span class="popup-stat-label">Name:</span>
                <span class="popup-stat-value">${dioceseName}</span>
            </div>
            <div class="popup-stat">
                <span class="popup-stat-label">${CONFIG.STATISTICS[statistic].label}:</span>
                <span class="popup-stat-value">${value}</span>
            </div>
            <div class="popup-stat">
                <span class="popup-stat-label">Year:</span>
                <span class="popup-stat-value">${diocese.Year}</span>
            </div>
            <div class="popup-stat">
                <span class="popup-stat-label">Type:</span>
                <span class="popup-stat-value">${diocese.Type_of_Jurisdiction || 'N/A'}</span>
            </div>
            ${hasHistoricalData ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                    <button id="open-chart-modal-btn" class="chart-toggle-btn">
                        📊 View Historical Trends (${historicalData.length} years)
                    </button>
                </div>
            ` : ''}
        `;
    }
};
