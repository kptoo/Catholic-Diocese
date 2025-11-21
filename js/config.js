const CONFIG = {
    CSV_PATH: 'Catholic_Hier_All_Data.csv',
    
    MAP_CONFIG: {
        center: [41.9, 12.5],
        zoom: 6,
        minZoom: 3,
        maxZoom: 18
    },
    
    STATISTICS: {
        'Catholics': { label: 'Catholics', format: 'number' },
        'Total Population': { label: 'Total Population', format: 'number' },
        'Percent Catholic': { label: 'Percent Catholic', format: 'percent' },
        'Diocesan Priests': { label: 'Diocesan Priests', format: 'number' },
        'Religious Priests': { label: 'Religious Priests', format: 'number' },
        'Total Priests': { label: 'Total Priests', format: 'number' },
        'Catholics Per Priest': { label: 'Catholics Per Priest', format: 'number' },
        'Permanent Deacons': { label: 'Permanent Deacons', format: 'number' },
        'Male Religious': { label: 'Male Religious', format: 'number' },
        'Female Religious': { label: 'Female Religious', format: 'number' },
        'Parishes': { label: 'Parishes', format: 'number' }
    },
    
    HEATMAP_COLORS: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
    
    CHART_CONFIG: {
        margin: { top: 10, right: 120, bottom: 30, left: 50 },
        height: 200
    }
};
