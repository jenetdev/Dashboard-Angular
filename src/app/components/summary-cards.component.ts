import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="summary-cards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Card 1: Total Revenue -->
      <div 
        [class]="'group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all duration-500 ease-out ' + 
        (revenueFlash ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]' : 'hover:shadow-md hover:border-indigo-500/40 hover:shadow-indigo-500/5')"
      >
        <span *ngIf="revenueFlash" class="absolute top-3 right-3 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 dark:bg-slate-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-slate-500 dark:bg-slate-400"></span>
        </span>
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span [class]="'text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight block transition-colors duration-300 ' + (revenueFlash ? 'text-indigo-600 dark:text-indigo-400' : '')">
              {{ formatCurrency(summary.totalRevenue) }}
            </span>
          </div>
          <div [class]="'p-3 rounded-2xl border bg-indigo-50 text-indigo-600 border-indigo-100/50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30 transition-transform group-hover:scale-105 duration-300 ' + (revenueFlash ? 'scale-110' : '')">
            <!-- DollarSign Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <span [class]="'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-transform duration-300 ' + 
            (summary.revenueChange >= 0 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100/60 dark:border-emerald-900/30' 
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100/60 dark:border-rose-900/30') + 
            (revenueFlash ? ' scale-105' : '')"
          >
            <!-- Arrow Up / Down -->
            <svg *ngIf="summary.revenueChange >= 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
            <svg *ngIf="summary.revenueChange < 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17h10V7"></path><path d="M17 17 7 7"></path></svg>
            <span>{{ abs(summary.revenueChange) }}%</span>
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
        </div>
      </div>

      <!-- Card 2: Total Orders -->
      <div 
        [class]="'group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all duration-500 ease-out ' + 
        (ordersFlash ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.02]' : 'hover:shadow-md hover:border-emerald-500/40 hover:shadow-emerald-500/5')"
      >
        <span *ngIf="ordersFlash" class="absolute top-3 right-3 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 dark:bg-slate-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-slate-500 dark:bg-slate-400"></span>
        </span>
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Orders
            </span>
            <span [class]="'text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight block transition-colors duration-300 ' + (ordersFlash ? 'text-indigo-600 dark:text-indigo-400' : '')">
              {{ formatNumber(summary.totalOrders) }}
            </span>
          </div>
          <div [class]="'p-3 rounded-2xl border bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30 transition-transform group-hover:scale-105 duration-300 ' + (ordersFlash ? 'scale-110' : '')">
            <!-- ShoppingBag Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" x2="21" y1="6" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <span [class]="'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-transform duration-300 ' + 
            (summary.ordersChange >= 0 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100/60 dark:border-emerald-900/30' 
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100/60 dark:border-rose-900/30') + 
            (ordersFlash ? ' scale-105' : '')"
          >
            <svg *ngIf="summary.ordersChange >= 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
            <svg *ngIf="summary.ordersChange < 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17h10V7"></path><path d="M17 17 7 7"></path></svg>
            <span>{{ abs(summary.ordersChange) }}%</span>
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
        </div>
      </div>

      <!-- Card 3: Average Order Value -->
      <div 
        [class]="'group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all duration-500 ease-out ' + 
        (aovFlash ? 'border-amber-500 ring-2 ring-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.02]' : 'hover:shadow-md hover:border-amber-500/40 hover:shadow-amber-500/5')"
      >
        <span *ngIf="aovFlash" class="absolute top-3 right-3 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 dark:bg-slate-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-slate-500 dark:bg-slate-400"></span>
        </span>
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Average Order Value
            </span>
            <span [class]="'text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight block transition-colors duration-300 ' + (aovFlash ? 'text-indigo-600 dark:text-indigo-400' : '')">
              {{ formatCurrency(summary.averageOrderValue) }}
            </span>
          </div>
          <div [class]="'p-3 rounded-2xl border bg-amber-50 text-amber-600 border-amber-100/50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30 transition-transform group-hover:scale-105 duration-300 ' + (aovFlash ? 'scale-110' : '')">
            <!-- Receipt Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"></path><path d="M16 8H8"></path><path d="M16 12H8"></path><path d="M13 16H8"></path></svg>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <span [class]="'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-transform duration-300 ' + 
            (summary.aovChange >= 0 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100/60 dark:border-emerald-900/30' 
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100/60 dark:border-rose-900/30') + 
            (aovFlash ? ' scale-105' : '')"
          >
            <svg *ngIf="summary.aovChange >= 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
            <svg *ngIf="summary.aovChange < 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17h10V7"></path><path d="M17 17 7 7"></path></svg>
            <span>{{ abs(summary.aovChange) }}%</span>
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
        </div>
      </div>

      <!-- Card 4: Conversion Rate -->
      <div 
        [class]="'group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all duration-500 ease-out ' + 
        (conversionFlash ? 'border-rose-500 ring-2 ring-rose-500/10 shadow-lg shadow-rose-500/10 scale-[1.02]' : 'hover:shadow-md hover:border-rose-500/40 hover:shadow-rose-500/5')"
      >
        <span *ngIf="conversionFlash" class="absolute top-3 right-3 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 dark:bg-slate-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-slate-500 dark:bg-slate-400"></span>
        </span>
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Conversion Rate
            </span>
            <span [class]="'text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight block transition-colors duration-300 ' + (conversionFlash ? 'text-indigo-600 dark:text-indigo-400' : '')">
              {{ summary.conversionRate }}%
            </span>
          </div>
          <div [class]="'p-3 rounded-2xl border bg-rose-50 text-rose-600 border-rose-100/50 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30 transition-transform group-hover:scale-105 duration-300 ' + (conversionFlash ? 'scale-110' : '')">
            <!-- Target Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <span [class]="'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-transform duration-300 ' + 
            (summary.conversionChange >= 0 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100/60 dark:border-emerald-900/30' 
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100/60 dark:border-rose-900/30') + 
            (conversionFlash ? ' scale-105' : '')"
          >
            <svg *ngIf="summary.conversionChange >= 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
            <svg *ngIf="summary.conversionChange < 0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17h10V7"></path><path d="M17 17 7 7"></path></svg>
            <span>{{ abs(summary.conversionChange) }}%</span>
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
        </div>
      </div>

    </div>
  `
})
export class SummaryCardsComponent implements OnChanges {
  @Input({ required: true }) summary!: any;

  revenueFlash = false;
  ordersFlash = false;
  aovFlash = false;
  conversionFlash = false;

  private prevRevenue = 0;
  private prevOrders = 0;
  private prevAov = 0;
  private prevConversion = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary'] && this.summary) {
      if (this.prevRevenue && this.summary.totalRevenue !== this.prevRevenue) {
        this.revenueFlash = true;
        setTimeout(() => this.revenueFlash = false, 1200);
      }
      if (this.prevOrders && this.summary.totalOrders !== this.prevOrders) {
        this.ordersFlash = true;
        setTimeout(() => this.ordersFlash = false, 1200);
      }
      if (this.prevAov && this.summary.averageOrderValue !== this.prevAov) {
        this.aovFlash = true;
        setTimeout(() => this.aovFlash = false, 1200);
      }
      if (this.prevConversion && this.summary.conversionRate !== this.prevConversion) {
        this.conversionFlash = true;
        setTimeout(() => this.conversionFlash = false, 1200);
      }

      this.prevRevenue = this.summary.totalRevenue;
      this.prevOrders = this.summary.totalOrders;
      this.prevAov = this.summary.averageOrderValue;
      this.prevConversion = this.summary.conversionRate;
    }
  }

  abs(val: number): number {
    return Math.abs(val);
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('en-US').format(val);
  }
}
