// chartUtils.js - Handle tooltip and chart rendering

const ChartUtils = {
    tooltip: null,
    chart: null,
    tooltipTimeout: null,

    init() {
        this.tooltip = document.getElementById('tooltip');
    },

    showTooltip(event, row, statistic, history) {
        clearTimeout(this.tooltipTimeout);
        
        const currentValue = DataLoader.getStatisticValue(row, statistic);
        const formattedValue = currentValue !== null ? currentValue.toLocaleString() : 'N/A';

        this.tooltip.innerHTML = `
            <div class="tooltip-header">${row.Name || row.Diocese}</div>
            <div class="tooltip-content">
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">${statistic}:</span>
                    <span class="tooltip-stat-value">${formattedValue}</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Year:</span>
                    <span class="tooltip-stat-value">${row.Year}</span>
                </div>
                ${row.Country ? `
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Country:</span>
                    <span class="tooltip-stat-value">${row.Country}</span>
                </div>
                ` : ''}
            </div>
            <div class="tooltip-chart">
                <canvas id="history-chart"></canvas>
            </div>
        `;

        const x = event.originalEvent.pageX + 15;
        const y = event.originalEvent.pageY + 15;
        
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
        this.tooltip.classList.add('visible');

        // Render chart after tooltip is visible
        this.tooltipTimeout = setTimeout(() => {
            this.renderHistoryChart(history, statistic);
        }, 50);
    },

    hideTooltip() {
        clearTimeout(this.tooltipTimeout);
        this.tooltip.classList.remove('visible');
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    },

    renderHistoryChart(history, statistic) {
        if (history.length < 2) return;

        const canvas = document.getElementById('history-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Fill missing values
        const filled = DataLoader.fillMissingValues(history, statistic);
        
        const labels = filled.map(row => row.Year);
        const data = filled.map(row => {
            const value = DataLoader.getStatisticValue(row, statistic);
            return value !== null ? value : row[statistic + '_filled'];
        });

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: statistic,
                    data: data,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            },
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
};
