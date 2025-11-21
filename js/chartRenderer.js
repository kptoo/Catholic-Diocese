const ChartRenderer = {
    renderChart(data, statistic) {
        const container = document.getElementById('chart-container');
        if (!container || !data || data.length <= 1) return;
        
        container.innerHTML = '';
        
        const chartData = data
            .map(d => ({
                year: parseInt(d.Year),
                value: parseFloat(d[statistic])
            }))
            .filter(d => !isNaN(d.year) && !isNaN(d.value));
        
        if (chartData.length === 0) return;
        
        const width = container.offsetWidth;
        const height = CONFIG.CHART_CONFIG.height;
        const margin = CONFIG.CHART_CONFIG.margin;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const x = d3.scaleLinear()
            .domain(d3.extent(chartData, d => d.year))
            .range([0, chartWidth]);
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.value) * 1.1])
            .range([chartHeight, 0]);
        
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);
        
        g.append('path')
            .datum(chartData)
            .attr('fill', 'none')
            .attr('stroke', '#4a90e2')
            .attr('stroke-width', 2)
            .attr('d', line);
        
        g.selectAll('circle')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.value))
            .attr('r', 3)
            .attr('fill', '#4a90e2');
        
        const xAxis = d3.axisBottom(x)
            .ticks(Math.min(5, chartData.length))
            .tickFormat(d3.format('d'));
        
        const yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickFormat(d => {
                if (d >= 1000000) return (d / 1000000).toFixed(1) + 'M';
                if (d >= 1000) return (d / 1000).toFixed(0) + 'K';
                return d.toFixed(0);
            });
        
        g.append('g')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(xAxis)
            .style('font-size', '10px');
        
        g.append('g')
            .call(yAxis)
            .style('font-size', '10px');
    }
};
