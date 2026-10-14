interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, height = 200, formatValue }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  const chartHeight = height - 30;
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3" style={{ height }}>
        {data.map((d) => {
          const h = (d.value / max) * chartHeight;
          return (
            <div key={d.name} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-display text-xs font-bold text-slate-200">
                {formatValue ? formatValue(d.value) : d.value}
              </span>
              <div className="flex w-full items-end justify-center" style={{ height: chartHeight }}>
                <div
                  className="w-full max-w-[2.5rem] rounded-t-lg transition-all duration-700 ease-out shadow-lg"
                  style={{ height: h, backgroundColor: d.color ?? '#7C3AED', minHeight: 4 }}
                />
              </div>
              <span className="text-xs font-medium text-slate-400">{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 180, color = '#7C3AED' }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 100;
  const h = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * h;
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#lineGrad)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="text-xs text-slate-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 160, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {data.map((d, i) => {
            const pct = total > 0 ? d.value / total : 0;
            const dash = pct * circumference;
            const seg = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700"
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="font-display text-2xl font-bold text-white">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-slate-400">{centerLabel}</span>}
        </div>
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-slate-300">{d.label}</span>
            <span className="font-display text-sm font-bold text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DonutChart as PieChart };
