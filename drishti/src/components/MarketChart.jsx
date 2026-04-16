import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';

export default function MarketChart({ ticker, width = '100%', height = 300 }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#5e7490',
        fontFamily: "'Inter', system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(26, 39, 68, 0.4)', style: 1 },
        horzLines: { color: 'rgba(26, 39, 68, 0.4)', style: 1 },
      },
      timeScale: {
        borderColor: 'rgba(26, 39, 68, 0.8)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(26, 39, 68, 0.8)',
      },
      crosshair: {
        mode: 1,
        vertLine: { width: 1, color: '#7C5CFC', style: 3 },
        horzLine: { width: 1, color: '#7C5CFC', style: 3 },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    // Generate pseudo-realistic OHLC data
    const generateData = () => {
      let currentPrice = 3000;
      const data = [];
      const vols = [];
      let time = Math.floor(Date.UTC(2023, 0, 1) / 1000);
      let maArray = [];

      for (let i = 0; i < 100; i++) {
        time += 86400;
        const open = currentPrice + (Math.random() * 40 - 20);
        const high = open + Math.random() * 30;
        const low = open - Math.random() * 30;
        const close = Math.min(high, Math.max(low, open + (Math.random() * 40 - 20)));
        currentPrice = close;
        const isUp = close > open;

        data.push({ time, open, high, low, close });
        const volume = Math.random() * 1000000 + 500000;
        vols.push({
          time,
          value: volume,
          color: isUp ? 'rgba(0, 229, 160, 0.2)' : 'rgba(239, 68, 68, 0.2)'
        });
        maArray.push({ time, value: (open + close + high + low) / 4 });
      }

      const lineData = maArray.map((m, idx, arr) => {
        let sum = 0;
        const lookback = Math.min(idx + 1, 9);
        for (let j = 0; j < lookback; j++) sum += arr[idx - j].value;
        return { time: m.time, value: sum / lookback };
      });

      return { candles: data, volumes: vols, lineData };
    };

    const { candles, volumes, lineData } = generateData();

    // v5 API: chart.addSeries(SeriesType, options)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00E5A0',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#00E5A0',
      wickDownColor: '#ef4444',
      wickUpColor: '#00E5A0',
    });
    candleSeries.setData(candles);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
    });
    chart.priceScale('vol').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeries.setData(volumes);

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#7C5CFC',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    lineSeries.setData(lineData);

    // Resize
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width, height: newRect.height });
    });
    resizeObserver.observe(chartContainerRef.current);
    chart.timeScale().fitContent();

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [ticker]);

  return (
    <div style={{ position: 'relative', width, height, borderRadius: 12, overflow: 'hidden', border: '1px solid #1a2744', background: 'linear-gradient(180deg, #04070f, #080e1a)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)' }}>
      <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: '#f8fafc', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{ticker || 'NSE INDICES'}</h3>
        <p style={{ margin: 0, fontSize: 10, color: '#5e7490', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#00E5A0', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: '#00E5A0', borderRadius: '50%' }}></span>Candles</span>
          <span style={{ color: '#7C5CFC', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 2, background: '#7C5CFC' }}></span>9MA Line</span>
          <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: '#38bdf8', borderRadius: 2 }}></span>Volume Bars</span>
        </p>
      </div>
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%', paddingTop: 40 }} />
    </div>
  );
}
