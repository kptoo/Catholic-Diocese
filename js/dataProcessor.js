const DataProcessor = {
    processData(rawData) {
        const dioceseMap = new Map();
        
        rawData.forEach(row => {
            const dioceseId = row.ID;
            if (!dioceseMap.has(dioceseId)) {
                dioceseMap.set(dioceseId, []);
            }
            dioceseMap.get(dioceseId).push(row);
        });
        
        dioceseMap.forEach((records, dioceseId) => {
            records.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
            
            const columns = ['Catholics', 'Total Population', 'Percent Catholic', 
                           'Diocesan Priests', 'Religious Priests', 'Total Priests',
                           'Catholics Per Priest', 'Permanent Deacons', 'Male Religious',
                           'Female Religious', 'Parishes'];
            
            records.forEach((record, index) => {
                columns.forEach(col => {
                    if (!record[col] || record[col] === '' || record[col] === 'NA') {
                        if (index > 0 && records[index - 1][col] && 
                            records[index - 1][col] !== '' && 
                            records[index - 1][col] !== 'NA') {
                            record[col] = records[index - 1][col];
                        }
                    }
                });
            });
        });
        
        return dioceseMap;
    },
    
    getMostRecentData(dioceseMap) {
        const mostRecent = [];
        
        dioceseMap.forEach((records, dioceseId) => {
            if (records.length > 0) {
                mostRecent.push(records[records.length - 1]);
            }
        });
        
        return mostRecent;
    },
    
    getStatisticRange(data, statistic) {
        const values = data
            .map(d => parseFloat(d[statistic]))
            .filter(v => !isNaN(v) && v !== null);
        
        if (values.length === 0) return [0, 1];
        
        return [Math.min(...values), Math.max(...values)];
    },
    
    formatValue(value, format) {
        if (value === null || value === undefined || value === '' || value === 'NA') {
            return 'N/A';
        }
        
        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';
        
        if (format === 'percent') {
            return num.toFixed(2) + '%';
        } else if (format === 'number') {
            return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
        }
        
        return value;
    }
};
