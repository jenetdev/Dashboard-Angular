import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revenue-trend-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div class="space-y-1">
          <h3 class="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-2">
            <!-- TrendingUp Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="text-indigo-600 dark:text-indigo-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            <span>Revenue Growth Trend</span>
          </h3>
          <p class="text-xs text-slate-400 dark:text-slate-500">Monthly trajectory of aggregate transaction value</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <div class="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/40 dark:border-indigo-900/30 rounded-xl px-2.5 py-1 text-left">
            <span class="text-[9px] font-mono font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-wider block">MONTHLY AVG</span>
            <span class="text-xs font-semibold text-indigo-950 dark:text-indigo-200 font-mono">
              {{ formatCurrency(avgRevenue) }}
            </span>
          </div>
          <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/40 dark:border-emerald-900/30 rounded-xl px-2.5 py-1 text-left">
            <span class="text-[9px] font-mono font-bold text-emerald-400 dark:text-emerald-500 uppercase tracking-wider block">PEAK ({{ peakMonth }})</span>
            <span class="text-xs font-semibold text-emerald-950 dark:text-emerald-200 font-mono">
              {{ formatCurrency(peakRevenue) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Filters & Option Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-1.5 rounded-xl mb-6">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold pl-1.5 uppercase tracking-wider">Metrics</span>
          <div class="flex bg-slate-200/60 dark:bg-slate-900 p-0.5 rounded-lg">
            <button
              *ngFor="let view of ['omni', 'revenue', 'orders']"
              (click)="activeView = view"
              class="text-[10px] font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer"
              [ngClass]="activeView === view 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold' 
                : 'text-slate-500 dark:text-slate-400'"
            >
              {{ view === 'omni' ? 'Omni View' : view | titlecase }}
            </button>
          </div>
        </div>

        <button
          (click)="showTarget = !showTarget"
          class="inline-flex items-center gap-1 px-2.5 py-1 border rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
          [ngClass]="showTarget 
            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'"
        >
          <!-- Target Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" [class.animate-pulse]="showTarget" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          <span>{{ showTarget ? 'Target Line (ON)' : 'Target Line (OFF)' }}</span>
        </button>
      </div>

      <!-- SVG Drawing -->
      <div class="flex-1 w-full h-[280px] relative" (mouseleave)="hoveredIndex = null">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stop-color="#6366f1" stop-opacity="0.2" />
              <stop offset="95%" stop-color="#6366f1" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stop-color="#0ea5e9" stop-opacity="0.15" />
              <stop offset="95%" stop-color="#0ea5e9" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="40" x2="480" y1="20" y2="20" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="40" x2="480" y1="65" y2="65" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="40" x2="480" y1="110" y2="110" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="40" x2="480" y1="155" y2="155" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="1" />

          <!-- Target Reference Line -->
          <line *ngIf="showTarget" x1="40" x2="480" [attr.y1]="targetY" [attr.y2]="targetY" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 4" />
          <text *ngIf="showTarget" x="475" [attr.y]="targetY - 4" text-anchor="end" fill="currentColor" class="text-rose-600 dark:text-rose-400 font-bold text-[8px]">
            Target Limit ($20k)
          </text>

          <!-- Draw Revenue Area & Line -->
          <path *ngIf="activeView === 'omni' || activeView === 'revenue'" [attr.d]="revenueAreaPath" fill="url(#colorRevenue)" />
          <path *ngIf="activeView === 'omni' || activeView === 'revenue'" [attr.d]="revenueLinePath" fill="none" stroke="#6366f1" stroke-width="2.5" />

          <!-- Draw Orders Area & Line -->
          <path *ngIf="activeView === 'orders'" [attr.d]="ordersAreaPath" fill="url(#colorOrders)" />
          <path *ngIf="activeView === 'omni' || activeView === 'orders'" [attr.d]="ordersLinePath" fill="none" stroke="#0ea5e9" [attr.stroke-width]="activeView === 'omni' ? 2 : 2.5" [attr.stroke-dasharray]="activeView === 'omni' ? '4 4' : '0'" />

          <!-- Highlight Dots on Hover -->
          <g *ngIf="hoveredIndex !== null">
            <circle *ngIf="activeView === 'omni' || activeView === 'revenue'" [attr.cx]="getX(hoveredIndex)" [attr.cy]="getRevenueY(hoveredIndex)" r="5" fill="#6366f1" stroke="#ffffff" stroke-width="1.5" />
            <circle *ngIf="activeView === 'omni' || activeView === 'orders'" [attr.cx]="getX(hoveredIndex)" [attr.cy]="getOrdersY(hoveredIndex)" r="5" fill="#0ea5e9" stroke="#ffffff" stroke-width="1.5" />
          </g>

          <!-- Text Labels (X Axis Months) -->
          <text *ngFor="let m of data; let i = index" [attr.x]="getX(i)" y="174" text-anchor="middle" fill="currentColor" class="text-slate-400 dark:text-slate-500 font-sans text-[10px]">
            {{ m.name }}
          </text>

          <!-- Text Labels (Y Axis Revenue Scaling) -->
          <text x="35" y="24" text-anchor="end" fill="currentColor" class="text-slate-400 dark:text-slate-500 font-mono text-[9px]">$30k</text>
          <text x="35" y="69" text-anchor="end" fill="currentColor" class="text-slate-400 dark:text-slate-500 font-mono text-[9px]">$20k</text>
          <text x="35" y="114" text-anchor="end" fill="currentColor" class="text-slate-400 dark:text-slate-500 font-mono text-[9px]">$10k</text>
          <text x="35" y="159" text-anchor="end" fill="currentColor" class="text-slate-400 dark:text-slate-500 font-mono text-[9px]">$0</text>

          <!-- Hover Target Columns -->
          <rect
            *ngFor="let m of data; let i = index"
            [attr.x]="getX(i) - 20"
            y="10"
            width="40"
            height="150"
            fill="transparent"
            class="cursor-pointer"
            (mouseover)="hoveredIndex = i"
          />
        </svg>

        <!-- Custom Tooltip Overlay -->
        <div
          *ngIf="hoveredIndex !== null"
          class="absolute bg-slate-900 text-slate-100 border border-slate-800 p-3.5 rounded-xl shadow-xl text-xs font-sans space-y-1.5 pointer-events-none z-30"
          [style.left.px]="getTooltipLeft(hoveredIndex)"
          [style.top.px]="30"
        >
          <p class="font-semibold text-slate-300">{{ data[hoveredIndex].name }}</p>
          <div class="space-y-1">
            <div *ngIf="activeView === 'omni' || activeView === 'revenue'" class="flex items-center gap-4 justify-between">
              <span class="text-slate-400">Revenue:</span>
              <span class="font-mono font-medium text-indigo-400">{{ formatCurrency(data[hoveredIndex].revenue) }}</span>
            </div>
            <div *ngIf="activeView === 'omni' || activeView === 'orders'" class="flex items-center gap-4 justify-between">
              <span class="text-slate-400">Orders:</span>
              <span class="font-mono font-medium text-sky-400">{{ data[hoveredIndex].orders }} orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RevenueTrendChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) data!: any[];
  @Input() theme = 'light';

  activeView = 'omni';
  showTarget = true;
  hoveredIndex: number | null = null;

  avgRevenue = 0;
  peakRevenue = 0;
  peakMonth = '';

  // Chart dimensions corresponding to viewBox
  private chartWidth = 500;
  private chartHeight = 200;
  private leftPad = 40;
  private rightPad = 20;
  private topPad = 20;
  private bottomPad = 45;

  private maxRevenueVal = 35000;
  private maxOrdersVal = 300;

  ngOnInit() {
    this.computeStats();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.computeStats();
    }
  }

  computeStats() {
    if (!this.data || this.data.length === 0) return;
    const sum = this.data.reduce((acc, curr) => acc + curr.revenue, 0);
    this.avgRevenue = sum / this.data.length;

    let peak = 0;
    let peakM = '';
    this.data.forEach((month) => {
      if (month.revenue > peak) {
        peak = month.revenue;
        peakM = month.name;
      }
    });
    this.peakRevenue = peak;
    this.peakMonth = peakM;

    // Dynamically calculate maximum bounds
    const maxRev = Math.max(...this.data.map(d => d.revenue));
    this.maxRevenueVal = Math.max(30000, maxRev * 1.15);

    const maxOrd = Math.max(...this.data.map(d => d.orders));
    this.maxOrdersVal = Math.max(250, maxOrd * 1.15);
  }

  getX(index: number): number {
    const usableWidth = this.chartWidth - this.leftPad - this.rightPad;
    const segmentWidth = usableWidth / (this.data.length - 1);
    return this.leftPad + index * segmentWidth;
  }

  getRevenueY(index: number): number {
    const usableHeight = this.chartHeight - this.topPad - this.bottomPad;
    const value = this.data[index].revenue;
    return this.chartHeight - this.bottomPad - (value / this.maxRevenueVal) * usableHeight;
  }

  getOrdersY(index: number): number {
    const usableHeight = this.chartHeight - this.topPad - this.bottomPad;
    const value = this.data[index].orders;
    return this.chartHeight - this.bottomPad - (value / this.maxOrdersVal) * usableHeight;
  }

  get targetY(): number {
    const usableHeight = this.chartHeight - this.topPad - this.bottomPad;
    return this.chartHeight - this.bottomPad - (20000 / this.maxRevenueVal) * usableHeight;
  }

  // Path SVG Builders
  get revenueLinePath(): string {
    if (!this.data || this.data.length === 0) return '';
    return this.data.map((_, i) => `${i === 0 ? 'M' : 'L'} ${this.getX(i)} ${this.getRevenueY(i)}`).join(' ');
  }

  get revenueAreaPath(): string {
    if (!this.data || this.data.length === 0) return '';
    const line = this.revenueLinePath;
    const baseLineY = this.chartHeight - this.bottomPad;
    return `${line} L ${this.getX(this.data.length - 1)} ${baseLineY} L ${this.getX(0)} ${baseLineY} Z`;
  }

  get ordersLinePath(): string {
    if (!this.data || this.data.length === 0) return '';
    return this.data.map((_, i) => `${i === 0 ? 'M' : 'L'} ${this.getX(i)} ${this.getOrdersY(i)}`).join(' ');
  }

  get ordersAreaPath(): string {
    if (!this.data || this.data.length === 0) return '';
    const line = this.ordersLinePath;
    const baseLineY = this.chartHeight - this.bottomPad;
    return `${line} L ${this.getX(this.data.length - 1)} ${baseLineY} L ${this.getX(0)} ${baseLineY} Z`;
  }

  getTooltipLeft(index: number): number {
    // Tooltip position aligned with selected point relative to a 500px wide scaling
    const containerPercent = this.getX(index) / this.chartWidth;
    return Math.max(10, containerPercent * 340); // bounds inside the flex element
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }
}

@Component({
  selector: 'app-category-breakdown-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-full" (mouseleave)="hoveredSegment = null">
      <div class="flex items-center justify-between mb-6">
        <div class="space-y-1">
          <h3 class="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-2">
            <!-- PieChart Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            <span>Category Contribution</span>
          </h3>
          <p class="text-xs text-slate-400 dark:text-slate-500">Revenue split across business sectors</p>
        </div>
      </div>

      <div class="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[220px]">
        
        <!-- SVG Donut Circle -->
        <div class="w-[180px] h-[180px] relative flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
            <!-- Render Segments -->
            <circle
              *ngFor="let seg of segments; let i = index"
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              [attr.stroke]="seg.color"
              [attr.stroke-width]="hoveredSegment === i ? 22 : 18"
              [attr.stroke-dasharray]="seg.dashArray"
              [attr.stroke-dashoffset]="seg.dashOffset"
              class="transition-all duration-300 cursor-pointer"
              (mouseover)="hoveredSegment = i"
            />
          </svg>

          <!-- Central Absolute Text -->
          <div class="absolute flex flex-col items-center justify-center pointer-events-none">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Share</span>
            <span class="text-xl font-bold text-slate-800 dark:text-slate-200">100%</span>
          </div>

          <!-- Category Breakout Tooltip -->
          <div
            *ngIf="hoveredSegment !== null"
            class="absolute bg-slate-900 text-slate-100 border border-slate-800 p-3 rounded-xl shadow-xl text-xs font-sans space-y-1 z-30 pointer-events-none -bottom-1"
          >
            <p class="font-semibold text-slate-300">{{ segments[hoveredSegment].name }}</p>
            <div class="flex items-center gap-4 justify-between">
              <span class="text-slate-400">Share:</span>
              <span class="font-mono font-semibold text-emerald-400">{{ segments[hoveredSegment].percentage }}%</span>
            </div>
            <div class="flex items-center gap-4 justify-between">
              <span class="text-slate-400">Value:</span>
              <span class="font-mono text-slate-300">{{ formatCurrency(segments[hoveredSegment].value) }}</span>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex-1 space-y-2.5 w-full">
          <div 
            *ngFor="let item of segments; let i = index" 
            class="flex items-center justify-between text-xs transition-all duration-200"
            [class.scale-[1.03]]="hoveredSegment === i"
            [class.opacity-60]="hoveredSegment !== null && hoveredSegment !== i"
            (mouseover)="hoveredSegment = i"
            (mouseleave)="hoveredSegment = null"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-2.5 h-2.5 rounded-full shrink-0"
                [style.background-color]="item.color"
              ></span>
              <span class="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[110px] sm:max-w-none">
                {{ item.name }}
              </span>
            </div>
            <div class="flex items-center gap-3 font-mono">
              <span class="text-slate-400 dark:text-slate-500">
                {{ formatCurrency(item.value) }}
              </span>
              <span class="font-semibold text-slate-800 dark:text-slate-200 w-10 text-right">
                {{ item.percentage }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoryBreakdownChartComponent {
  @Input({ required: true }) data!: any[];
  @Input() theme = 'light';

  hoveredSegment: number | null = null;

  get segments() {
    if (!this.data) return [];
    const r = 70;
    const circ = 2 * Math.PI * r; // ~439.82
    let acc = 0;
    return this.data.map((item) => {
      const value = item.percentage;
      const dashArray = `${(value * circ) / 100} ${circ}`;
      const dashOffset = -((acc * circ) / 100);
      acc += value;
      return {
        ...item,
        dashArray,
        dashOffset
      };
    });
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }
}
