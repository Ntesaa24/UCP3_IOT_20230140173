document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const report = data.datasensorreport[0];
        const sensorData = report.sensordata;

        // Update Header Info
        document.getElementById('location-info').innerText = 
            `${report.institute} - ${report.faculty} (${report.major})`;

        // Prepare data arrays
        const labels = [];
        const temperatures = [];
        const humidities = [];
        const pressures = [];

        sensorData.forEach(entry => {
            labels.push(new Date(entry.timestamp));
            temperatures.push(entry.temperature);
            humidities.push(entry.humidity);
            pressures.push(entry.pressure);
        });

        // Common Chart Options
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1e293b',
                    bodyColor: '#1e293b',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, family: 'Inter', weight: 'bold' },
                    bodyFont: { size: 13, family: 'Inter' },
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM d'
                        }
                    },
                    grid: {
                        display: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#64748b'
                    },
                    beginAtZero: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };

        // Create Gradients
        const getGradient = (ctx, colorStart, colorEnd) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, colorStart);
            gradient.addColorStop(1, colorEnd);
            return gradient;
        };

        // Temperature Chart (Red/Orange)
        const ctxTemp = document.getElementById('tempChart').getContext('2d');
        new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: '#ef4444', // red-500
                    backgroundColor: getGradient(ctxTemp, 'rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.0)'),
                    borderWidth: 3,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#ef4444',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        });

        // Humidity Chart (Blue - Bar)
        const ctxHumid = document.getElementById('humidityChart').getContext('2d');
        new Chart(ctxHumid, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidities,
                    backgroundColor: getGradient(ctxHumid, 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.2)'),
                    hoverBackgroundColor: '#3b82f6',
                    borderColor: '#3b82f6', // blue-500
                    borderWidth: 1,
                    borderRadius: 4, // Make the tops of the bars slightly rounded
                    borderSkipped: false
                }]
            },
            options: commonOptions
        });

        // Pressure Chart (Purple/Indigo)
        const ctxPress = document.getElementById('pressureChart').getContext('2d');
        new Chart(ctxPress, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pressure (hPa)',
                    data: pressures,
                    borderColor: '#8b5cf6', // violet-500
                    backgroundColor: getGradient(ctxPress, 'rgba(139, 92, 246, 0.5)', 'rgba(139, 92, 246, 0.0)'),
                    borderWidth: 3,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#8b5cf6',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        });

    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('location-info').innerText = "Failed to load data.";
    }
});
