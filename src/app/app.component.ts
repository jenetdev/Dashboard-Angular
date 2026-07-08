import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryCardsComponent } from './components/summary-cards.component';
import { RevenueTrendChartComponent, CategoryBreakdownChartComponent } from './components/charts.component';
import { DataTableComponent } from './components/data-table.component';

const SAMPLE_CUSTOMERS = [
  { name: 'Liam Neeson', email: 'liam.n@example.com' },
  { name: 'Olivia Wilde', email: 'olivia.w@example.com' },
  { name: 'Noah Schnapp', email: 'noah.s@example.com' },
  { name: 'Emma Watson', email: 'emma.w@example.com' },
  { name: 'Oliver Jackson', email: 'oliver.j@example.com' },
  { name: 'Charlotte Gainsbourg', email: 'charlotte.g@example.com' },
  { name: 'Elijah Wood', email: 'elijah.w@example.com' },
  { name: 'Amelia Earhart', email: 'amelia.e@example.com' },
  { name: 'James McAvoy', email: 'james.m@example.com' },
  { name: 'Sophia Loren', email: 'sophia.l@example.com' },
  { name: 'Lucas Hedges', email: 'lucas.h@example.com' },
  { name: 'Mia Farrow', email: 'mia.f@example.com' },
  { name: 'Mason Mount', email: 'mason.m@example.com' },
  { name: 'Isabella Rossellini', email: 'isabella.r@example.com' }
];

const CATEGORY_ITEMS = [
  { name: 'Electronics', range: [80, 1200] },
  { name: 'Apparel', range: [15, 180] },
  { name: 'Home & Kitchen', range: [25, 350] },
  { name: 'Office Supplies', range: [8, 150] },
  { name: 'Books', range: [10, 60] }
];

interface Notification {
  id: string;
  message: string;
  sub: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SummaryCardsComponent,
    RevenueTrendChartComponent,
    CategoryBreakdownChartComponent,
    DataTableComponent
  ],
  template: `
    <div id="dashboard-root" [class]="'min-h-screen flex flex-col font-sans select-none antialiased relative transition-colors duration-300 ' + (theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-600')">
      
      <!-- Ambient Grid Background -->
      <div [class]="'absolute inset-0 pointer-events-none ' + (theme === 'dark' ? 'bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)]') + ' bg-[size:24px_24px]'"></div>

      <!-- Live Stream Top Status Bar -->
      <div id="pipeline-bar" class="bg-slate-900 text-slate-300 text-[11px] py-2 px-6 sm:px-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10 font-mono">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1.5 text-indigo-400 font-semibold uppercase tracking-wider text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" class="animate-pulse" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.886L5 10.8l5.088 1.914L12 18.6l1.912-5.886L19 10.8l-5.088-1.914Z"></path><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"></path><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"></path></svg>
            Active Segment
          </span>
          <span class="text-slate-500">|</span>
          <span class="flex items-center gap-1.5">
            <span [class]="'w-1.5 h-1.5 rounded-full ' + (isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500')"></span>
            Status: {{ isLive ? 'Streaming Live' : 'Paused' }}
          </span>
        </div>
        
        <div class="flex items-center gap-5">
          <span class="hidden sm:inline">
            Processed Live: <strong class="text-white font-semibold">{{ liveOrdersCount }} orders</strong>
          </span>
          <span class="hidden md:inline">
            Average Feed Velocity: <strong class="text-indigo-300 font-semibold">5.5s</strong>
          </span>
          <div class="flex items-center gap-2 border-l border-slate-800 pl-4">
            <button
              (click)="isLive = !isLive"
              class="p-1 rounded-md transition-all hover:bg-slate-800 hover:text-white cursor-pointer"
              [class.text-emerald-400]="isLive"
              [class.text-slate-400]="!isLive"
              [title]="isLive ? 'Pause Stream Simulation' : 'Resume Stream Simulation'"
            >
              <svg *ngIf="isLive" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>
              <svg *ngIf="!isLive" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
            </button>
            <button
              (click)="triggerNewOrder()"
              class="p-1 rounded-md text-indigo-400 hover:text-indigo-300 transition-all hover:bg-slate-800 cursor-pointer"
              title="Force New Demo Order"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Header -->
      <header id="dashboard-header" class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 sticky top-0 z-20 py-5 px-6 sm:px-8 shadow-sm shadow-slate-100/50 dark:shadow-none transition-colors duration-300">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <span>Ops Ledger Pipeline</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
              Revenue &amp; Orders Controller
            </h1>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">LEDGER SYNC</span>
              <span class="text-xs text-slate-600 dark:text-slate-300 font-medium font-mono">
                {{ todayString }}
              </span>
            </div>
            <button
              (click)="fetchDashboardData()"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-75 hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin-slow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M16 3h5v5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 21H3v-5"></path></svg>
              <span>Hard Sync</span>
            </button>

            <button
              (click)="toggleTheme()"
              class="inline-flex items-center justify-center p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-75 rounded-xl text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
              [title]="theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
            >
              <!-- Sun / Moon icons -->
              <svg *ngIf="theme === 'light'" class="text-slate-600" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
              <svg *ngIf="theme === 'dark'" class="text-amber-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Layout Body -->
      <main *ngIf="status === 'success' && data" id="dashboard-main" class="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8 flex flex-col gap-12 relative">
        
        <!-- Live Data Feed Control Panel -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
          <div class="flex items-center gap-3">
            <div class="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850">
              <span [class]="'absolute inline-flex h-3.5 w-3.5 rounded-full opacity-35 ' + (isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-300')"></span>
              <span [class]="'relative inline-flex rounded-full h-2 w-2 ' + (isLive ? 'bg-emerald-500' : 'bg-slate-400')"></span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold block tracking-wider">LIVE DATA FEED MONITOR</span>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {{ isLive ? 'Continuous Stream Active' : 'Simulation Paused' }}
                </span>
                <span [class]="'text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold transition-all duration-300 ' + 
                  (secondsSinceLast === 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 animate-pulse' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400')">
                  {{ secondsSinceLast === 0 ? '• New entry received' : 'Last update: ' + secondsSinceLast + 's ago' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              (click)="triggerNewOrder()"
              class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all w-full sm:w-auto ml-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="fill-white" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Simulate Order</span>
            </button>
          </div>
        </div>

        <!-- Section 1: KPI Cards -->
        <section id="summary-section" class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Performance Indicators
            </h2>
            <span *ngIf="isLive" class="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono font-medium animate-pulse">
              &bull; Live stream auto-updating
            </span>
          </div>
          <div>
            <app-summary-cards [summary]="data.summary"></app-summary-cards>
          </div>
        </section>

        <!-- Section 2: Visual Charts -->
        <section id="trends-section" class="flex flex-col gap-4">
          <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Distribution &amp; Trajectory
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <app-revenue-trend-chart [data]="data.revenueTrend" [theme]="theme"></app-revenue-trend-chart>
            </div>
            <div>
              <app-category-breakdown-chart [data]="data.categoryBreakdown" [theme]="theme"></app-category-breakdown-chart>
            </div>
          </div>
        </section>

        <!-- Section 3: Ledger DataTable -->
        <section id="ledger-section" class="flex flex-col gap-4">
          <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Audit Ledger
          </h2>
          <div>
            <app-data-table [orders]="data.orders"></app-data-table>
          </div>
        </section>
      </main>

      <!-- Loading/Error Fallback States -->
      <div *ngIf="status === 'loading'" class="flex-1 flex flex-col items-center justify-center p-12 gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin text-indigo-600 dark:text-indigo-400" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="6"></line><line x1="12" x2="12" y1="18" y2="22"></line><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"></line><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"></line><line x1="2" x2="6" y1="12" y2="12"></line><line x1="18" x2="22" y1="12" y2="12"></line><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"></line><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"></line></svg>
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-400 font-mono">Initializing enterprise ledger sync...</p>
      </div>

      <div *ngIf="status === 'error'" class="flex-1 flex flex-col items-center justify-center p-12 gap-4 text-center max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="text-rose-500" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Connection Interrupted</h3>
        <p class="text-xs text-slate-500 leading-relaxed">{{ errorMessage }}</p>
        <button
          (click)="fetchDashboardData()"
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
        >
          Retry Connection Sync
        </button>
      </div>

      <!-- Footer Segment -->
      <footer id="dashboard-footer" class="py-6 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Ops Ledger Pipeline &bull; Secure Enterprise Environment</span>
          <span>© 2026 Local Portal Host &bull; Port 3000 Feed</span>
        </div>
      </footer>

      <!-- Custom Toast Slide-In Notifications -->
      <div class="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        <div
          *ngFor="let notif of notifications"
          class="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-2xl shadow-xl flex items-start gap-3 pointer-events-auto transition-all duration-300 transform translate-y-0 scale-100 opacity-100"
        >
          <div class="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div class="flex-1 min-w-0 space-y-0.5">
            <p class="text-xs font-semibold text-white truncate">
              {{ notif.message }}
            </p>
            <p class="text-[10px] text-slate-400 leading-relaxed font-mono">
              {{ notif.sub }}
            </p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  status = 'loading';
  data: any = null;
  errorMessage = '';
  isLive = true;
  feedVelocity = 4500;
  secondsSinceLast = 0;
  notifications: Notification[] = [];

  theme = 'light';
  todayString = '';

  private orderIdCounter = 1025;
  private secondsTimerId: any = null;
  private feedTimerId: any = null;

  ngOnInit() {
    this.todayString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (typeof window !== 'undefined') {
      this.theme = localStorage.getItem('dashboard-theme') || 'light';
    }

    this.fetchDashboardData();
    this.startSecondsTimer();
    this.startFeedTimer();
  }

  ngOnDestroy() {
    this.clearSecondsTimer();
    this.clearFeedTimer();
  }

  fetchDashboardData() {
    this.status = 'loading';
    fetch('/mock-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        return res.json();
      })
      .then((json) => {
        this.data = json;
        this.status = 'success';
        this.secondsSinceLast = 0;
      })
      .catch((err) => {
        this.errorMessage = err.message || 'Failed to fetch ledger endpoint';
        this.status = 'error';
      });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-theme', this.theme);
    }
  }

  setFeedVelocity(val: number) {
    this.feedVelocity = val;
    this.isLive = true;
    this.startFeedTimer();
  }

  get liveOrdersCount(): number {
    if (!this.data || !this.data.orders) return 0;
    return this.data.orders.length - 8;
  }

  triggerNewOrder() {
    if (!this.data) return;

    this.secondsSinceLast = 0;

    const customer = SAMPLE_CUSTOMERS[Math.floor(Math.random() * SAMPLE_CUSTOMERS.length)];
    const catConfig = CATEGORY_ITEMS[Math.floor(Math.random() * CATEGORY_ITEMS.length)];
    
    const [minPrice, maxPrice] = catConfig.range;
    const amount = parseFloat((Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2));
    
    const nextId = `ORD-${this.orderIdCounter}`;
    this.orderIdCounter += 1;

    const statusPool = ['Completed', 'Completed', 'Completed', 'Processing', 'Shipped', 'Pending'];
    const orderStatus = statusPool[Math.floor(Math.random() * statusPool.length)];

    const todayStr = new Date().toISOString().split('T')[0];

    const newOrder = {
      id: nextId,
      customer: customer.name,
      email: customer.email,
      date: todayStr,
      amount: amount,
      status: orderStatus,
      category: catConfig.name,
      isNew: true
    };

    // Construct Slide-in Toast
    const notifId = Math.random().toString(36).substring(2, 11);
    const newNotif: Notification = {
      id: notifId,
      message: `New Order: ${newOrder.id}`,
      sub: `${customer.name} ordered ${catConfig.name} for $${amount.toFixed(2)}`
    };

    this.notifications = [newNotif, ...this.notifications.slice(0, 2)];

    setTimeout(() => {
      this.notifications = this.notifications.filter((n) => n.id !== notifId);
    }, 3500);

    // Update main Data structures
    const updatedOrders = [newOrder, ...this.data.orders.map((o: any) => ({ ...o, isNew: false }))].slice(0, 50);

    const newTotalRevenue = this.data.summary.totalRevenue + amount;
    const newTotalOrders = this.data.summary.totalOrders + 1;
    const newAOV = parseFloat((newTotalRevenue / newTotalOrders).toFixed(2));
    
    const newRevenueChange = parseFloat((this.data.summary.revenueChange + 0.05).toFixed(2));
    const newOrdersChange = parseFloat((this.data.summary.ordersChange + 0.04).toFixed(2));
    const newAOVChange = parseFloat((this.data.summary.aovChange + 0.01).toFixed(2));
    
    const summary = {
      ...this.data.summary,
      totalRevenue: newTotalRevenue,
      totalOrders: newTotalOrders,
      averageOrderValue: newAOV,
      revenueChange: newRevenueChange,
      ordersChange: newOrdersChange,
      aovChange: newAOVChange
    };

    const updatedBreakdown = this.data.categoryBreakdown.map((item: any) => {
      if (item.name === catConfig.name) {
        const updatedValue = item.value + amount;
        return { ...item, value: parseFloat(updatedValue.toFixed(2)) };
      }
      return item;
    });

    const sumCategoryValue = updatedBreakdown.reduce((sum: number, curr: any) => sum + curr.value, 0);
    const categoryBreakdown = updatedBreakdown.map((item: any) => ({
      ...item,
      percentage: Math.round((item.value / sumCategoryValue) * 100)
    }));

    const updatedTrend = this.data.revenueTrend.map((month: any) => {
      if (month.name === 'Jul') {
        return {
          ...month,
          revenue: parseFloat((month.revenue + amount).toFixed(2)),
          orders: month.orders + 1
        };
      }
      return month;
    });

    this.data = {
      ...this.data,
      summary,
      revenueTrend: updatedTrend,
      categoryBreakdown,
      orders: updatedOrders
    };
  }

  // Timer Management
  private startSecondsTimer() {
    this.clearSecondsTimer();
    this.secondsTimerId = setInterval(() => {
      if (this.isLive && this.status === 'success') {
        this.secondsSinceLast += 1;
      } else {
        this.secondsSinceLast = 0;
      }
    }, 1000);
  }

  private clearSecondsTimer() {
    if (this.secondsTimerId) {
      clearInterval(this.secondsTimerId);
      this.secondsTimerId = null;
    }
  }

  private startFeedTimer() {
    this.clearFeedTimer();

    const getNextInterval = () => {
      const base = this.feedVelocity;
      const fuzz = Math.floor(Math.random() * (base * 0.4)) - (base * 0.2);
      return Math.max(800, base + fuzz);
    };

    const scheduleNext = () => {
      if (this.isLive && this.status === 'success') {
        this.triggerNewOrder();
      }
      this.feedTimerId = setTimeout(scheduleNext, getNextInterval());
    };

    this.feedTimerId = setTimeout(scheduleNext, getNextInterval());
  }

  private clearFeedTimer() {
    if (this.feedTimerId) {
      clearTimeout(this.feedTimerId);
      this.feedTimerId = null;
    }
  }
}
