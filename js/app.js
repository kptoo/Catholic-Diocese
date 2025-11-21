const App = {
    dioceseMap: null,
    mostRecentData: null,
    currentStatistic: 'Catholics',
    
    async initialize() {
        try {
            MapManager.initialize('map');
            
            // Load CSV directly
            const rawData = await DataLoader.loadCSV(CONFIG.CSV_PATH);
            this.processAndRender(rawData);
            
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Error loading data. Please ensure Catholic_Hier_All_Data.csv is in the same directory as index.html');
        }
    },
    
    processAndRender(rawData) {
        console.log('Loaded data rows:', rawData.length);
        
        this.dioceseMap = DataProcessor.processData(rawData);
        console.log('Processed dioceses:', this.dioceseMap.size);
        
        this.mostRecentData = DataProcessor.getMostRecentData(this.dioceseMap);
        console.log('Most recent data points:', this.mostRecentData.length);
        
        this.setupEventListeners();
        this.render();
        MapManager.fitBounds(this.mostRecentData);
        
        // Initialize search after rendering
        SearchManager.initialize(this.mostRecentData, MapManager.markersLayer);
    },
    
    setupEventListeners() {
        const statisticSelect = document.getElementById('statistic-select');
        
        statisticSelect.addEventListener('change', (e) => {
            this.currentStatistic = e.target.value;
            this.render();
        });
    },
    
    render() {
        if (!this.mostRecentData || !this.dioceseMap) return;
        
        HeatmapRenderer.renderMap(
            this.mostRecentData, 
            this.dioceseMap, 
            this.currentStatistic
        );
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.initialize();
});
