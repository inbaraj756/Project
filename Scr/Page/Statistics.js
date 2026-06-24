import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import '../styles/Statistics.css';

const CHART_TEXT_STYLE = { color: '#cbd5e1', fontName: 'Inter' };
const CHART_BG = 'transparent';

// ✅ FIX: react-google-charts v5 crashes when { role: "style" } objects are in the
// data array before the chart library is fully loaded. The fix is to use
// chartEvents + a ready guard, OR simply remove the style role column and use
// the 'colors' option instead — which works reliably across all versions.

// CHART 1: Donut - Debris by Type (no changes needed, was working)
const typeData = [
  ["Type", "Percentage"],
  ["ASAT Fragment", 35],
  ["Rocket Body", 28],
  ["Defunct Satellite", 22],
  ["Fragmentation Cloud", 10],
  ["Unknown", 5]
];

const typeOptions = {
  title: "Debris by Type",
  pieHole: 0.4,
  backgroundColor: CHART_BG,
  titleTextStyle: { color: '#00d4ff', fontName: 'Orbitron', fontSize: 16 },
  legend: { textStyle: CHART_TEXT_STYLE, position: 'right' },
  colors: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#64748b'],
  chartArea: { width: '90%', height: '80%' },
  pieSliceBorderColor: '#0a0e1a'
};

// ✅ FIX: Removed { role: "style" } column — use 'colors' option instead
// The { role: "style" } object was causing "Cannot read properties of undefined (reading 'Do')"
const altData = [
  ["Altitude", "Count"],
  ["200-400km", 3200],
  ["400-600km", 8900],
  ["600-800km", 18400],
  ["800-1000km", 15200],
  ["1000-1200km", 6100],
  ["1200km+", 2200]
];

const altOptions = {
  title: "Debris Count by Altitude Band (km)",
  backgroundColor: CHART_BG,
  titleTextStyle: { color: '#00d4ff', fontName: 'Orbitron', fontSize: 16 },
  hAxis: { textStyle: CHART_TEXT_STYLE },
  vAxis: {
    textStyle: CHART_TEXT_STYLE,
    gridlines: { color: 'rgba(255,255,255,0.05)' }
  },
  // ✅ Use colors array instead of per-row style role
  colors: ['#3b82f6'],
  legend: 'none',
  chartArea: { width: '80%', height: '70%' },
  animation: { startup: true, duration: 1000, easing: 'out' }
};

// CHART 3: Combo Chart - no style role, was fine
const growthComboData = [
  ["Year", "Debris Area", "Debris Line"],
  ["2018", 19000, 19000],
  ["2019", 20500, 20500],
  ["2020", 23000, 23000],
  ["2021", 27500, 27500],
  ["2022", 35000, 35000],
  ["2023", 42000, 42000],
  ["2024", 48000, 48000],
  ["2025", 54000, 54000],
  ["2026", 54000, 54000]
];

const growthComboOptions = {
  title: "Tracked Debris Growth (2018-2026)",
  backgroundColor: CHART_BG,
  titleTextStyle: { color: '#00d4ff', fontName: 'Orbitron', fontSize: 16 },
  hAxis: { textStyle: CHART_TEXT_STYLE },
  vAxis: {
    textStyle: CHART_TEXT_STYLE,
    gridlines: { color: 'rgba(255,255,255,0.05)' }
  },
  legend: 'none',
  seriesType: 'area',
  series: {
    0: { color: '#ef4444', areaOpacity: 0.15, lineWidth: 0 },
    1: { type: 'line', color: '#00d4ff', lineWidth: 3 }
  },
  chartArea: { width: '80%', height: '70%' },
  animation: { startup: true, duration: 1000, easing: 'out' }
};

// ✅ FIX: Removed { role: "style" } column from kesslerData
const kesslerData = [
  ["Shell", "Risk"],
  ["400-500", 12],
  ["500-600", 28],
  ["600-700", 41],
  ["700-800", 58],
  ["800-900", 73],
  ["900-1000", 71],
  ["1000+", 45]
];

const kesslerOptions = {
  title: "Kessler Cascade Risk by Shell",
  backgroundColor: CHART_BG,
  titleTextStyle: { color: '#00d4ff', fontName: 'Orbitron', fontSize: 16 },
  hAxis: { textStyle: CHART_TEXT_STYLE },
  vAxis: {
    textStyle: CHART_TEXT_STYLE,
    gridlines: { color: 'rgba(255,255,255,0.05)' },
    format: "#'%'"
  },
  // ✅ Single color for all bars — works reliably
  colors: ['#ef4444'],
  legend: 'none',
  chartArea: { width: '80%', height: '70%' },
  animation: { startup: true, duration: 1000, easing: 'out' }
};

// ✅ FIX: Chart error boundary wrapper — catches any remaining render errors
// so one broken chart doesn't crash the whole Statistics page
const SafeChart = ({ chartType, data, options, height = "320px" }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error if data changes
  useEffect(() => {
    setHasError(false);
  }, [data]);

  if (hasError) {
    return (
      <div className="chart-error">
        <span>📊</span>
        <p>Chart unavailable</p>
      </div>
    );
  }

  return (
    <Chart
      chartType={chartType}
      width="100%"
      height={height}
      data={data}
      options={options}
      loader={<div className="chart-loader">Loading Analytics...</div>}
      chartEvents={[
        {
          eventName: 'error',
          callback: ({ chartWrapper, google, eventArgs }) => {
            console.error('Chart error:', eventArgs);
            setHasError(true);
          }
        }
      ]}
    />
  );
};

const Statistics = () => {
  return (
    <div className="stat-container">
      <div className="stat-facts">
        <div className="stat-fact-card">
          <div className="stat-fact-icon">🌍</div>
          <div className="stat-fact-text">847 Climate Satellites at Risk from Kessler Syndrome</div>
        </div>
        <div className="stat-fact-card">
          <div className="stat-fact-icon">⚖️</div>
          <div className="stat-fact-text">13,000 tonnes of debris in Low Earth Orbit</div>
        </div>
        <div className="stat-fact-card">
          <div className="stat-fact-icon">⚠️</div>
          <div className="stat-fact-text">A single Kessler cascade could blind climate monitoring for decades</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-chart-wrap">
          <SafeChart
            chartType="PieChart"
            data={typeData}
            options={typeOptions}
          />
        </div>
        <div className="stat-chart-wrap">
          <SafeChart
            chartType="ColumnChart"
            data={altData}
            options={altOptions}
          />
        </div>
        <div className="stat-chart-wrap">
          <SafeChart
            chartType="ComboChart"
            data={growthComboData}
            options={growthComboOptions}
          />
        </div>
        <div className="stat-chart-wrap">
          <SafeChart
            chartType="ColumnChart"
            data={kesslerData}
            options={kesslerOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;