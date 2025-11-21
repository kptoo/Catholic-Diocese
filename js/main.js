// main.js - Main application controller

const App = {
    csvPath: 'Catholic_Hier_All_Data.csv',
    currentYear: null,
    currentStatistic: 'Total Population',

    async init() {
        try {
            // Initialize components
            MapUtils.initMap();
            ChartUtils.init();

            // Load data
            console.log('Loading CSV data...');
            await DataLoader.loadCSV(this.csvPath);
            console.log('Data loaded:', DataLoader.data.length, 'rows');

            // Setup UI
            this.setupYearSelector();
            this.setupStatisticSelector();

            // Render initial view
            if (this.currentYear) {
                this.updateMap();
            }

        } catch (error) {
            console.error('Initialization error:', error);
            alert('Error loading data. Please ensure Catholic_Hier_All_Data.csv is in the same directory.');
        }
    },

    setupYearSelector() {
        const years = DataLoader.getUniqueYears();
        const yearSelect = document.getElementById('year');
        
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        if (years.length > 0) {
            this.currentYear = years[0];
            yearSelect.value = this.currentYear;
        }

        yearSelect.addEventListener('change', (e) => {
            this.currentYear = e.target.value;
            this.updateMap();
        });
    },

    setupStatisticSelector() {
        const statSelect = document.getElementById('statistic');
        statSelect.value = this.currentStatistic;

        statSelect.addEventListener('change', (e) => {
            this.currentStatistic = e.target.value;
            this.updateMap();
        });
    },

    updateMap() {
        const yearData = DataLoader.getDataForYear(this.currentYear);
        console.log(`Rendering ${yearData.length} dioceses for year ${this.currentYear}`);
        MapUtils.renderHeatMap(yearData, this.currentStatistic);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
