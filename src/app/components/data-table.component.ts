import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  template: `
    <div id="order-ledger-container" class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div class="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p class="text-xs text-slate-400 dark:text-slate-500">Stream of processed checkout requests and ledger entries</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 dark:border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Ledger Feed
            </span>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <!-- Search input -->
          <div class="relative">
            <!-- Search icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search ID, customer, email..."
              [(ngModel)]="searchQuery"
              class="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600"
            />
          </div>

          <!-- Status Dropdown -->
          <div class="relative">
            <!-- Filter icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            <select
              [(ngModel)]="statusFilter"
              class="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="All" class="dark:bg-slate-950">All Statuses</option>
              <option value="Completed" class="dark:bg-slate-950">Completed</option>
              <option value="Processing" class="dark:bg-slate-950">Processing</option>
              <option value="Shipped" class="dark:bg-slate-950">Shipped</option>
              <option value="Pending" class="dark:bg-slate-950">Pending</option>
              <option value="Cancelled" class="dark:bg-slate-950">Cancelled</option>
            </select>
          </div>

          <!-- Category Dropdown -->
          <div class="relative">
            <!-- Layers icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <select
              [(ngModel)]="categoryFilter"
              class="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option *ngFor="let cat of categories" [value]="cat" class="dark:bg-slate-950">
                {{ cat === 'All' ? 'All Categories' : cat }}
              </option>
            </select>
          </div>

        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
          <thead>
            <tr class="bg-slate-50/20 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <th class="py-4 px-6">ID</th>
              <th class="py-4 px-6">Customer</th>
              <th class="py-4 px-6">Category</th>
              <th class="py-4 px-6">Date</th>
              <th class="py-4 px-6 text-right">Amount</th>
              <th class="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr 
              *ngFor="let order of filteredOrders" 
              [class]="'hover:bg-slate-50/40 dark:hover:bg-slate-950/40 transition-colors duration-150 ' + (order.isNew ? 'border-l-2 border-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/10' : '')"
            >
              <td class="py-4 px-6 font-mono font-medium text-slate-900 dark:text-indigo-400">
                <div class="flex items-center gap-2">
                  <span *ngIf="order.isNew" class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping shrink-0"></span>
                  <span>{{ order.id }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="font-medium text-slate-950 dark:text-slate-100">{{ order.customer }}</div>
                <div class="text-slate-400 dark:text-slate-500 text-[10px] font-mono">{{ order.email }}</div>
              </td>
              <td class="py-4 px-6">
                <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-medium text-[10px]">
                  {{ order.category }}
                </span>
              </td>
              <td class="py-4 px-6 text-slate-400 dark:text-slate-500">
                {{ order.date }}
              </td>
              <td class="py-4 px-6 text-right font-mono font-semibold text-slate-950 dark:text-slate-100">
                {{ formatCurrency(order.amount) }}
              </td>
              <td class="py-4 px-6 text-center">
                <span [class]="'inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold ' + getStatusStyle(order.status)">
                  <!-- Inline SVGs for status types -->
                  <svg *ngIf="order.status === 'Completed'" xmlns="http://www.w3.org/2000/svg" class="mr-1 inline" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <svg *ngIf="order.status === 'Processing'" xmlns="http://www.w3.org/2000/svg" class="mr-1 inline animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="6"></line><line x1="12" x2="12" y1="18" y2="22"></line><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"></line><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"></line><line x1="2" x2="6" y1="12" y2="12"></line><line x1="18" x2="22" y1="12" y2="12"></line><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"></line><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"></line></svg>
                  <svg *ngIf="order.status === 'Shipped' || order.status === 'Pending'" xmlns="http://www.w3.org/2000/svg" class="mr-1 inline" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <svg *ngIf="order.status === 'Cancelled'" xmlns="http://www.w3.org/2000/svg" class="mr-1 inline" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="16"></line><line x1="12" x2="12" y1="16" y2="16"></line></svg>
                  <span>{{ order.status }}</span>
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr *ngIf="filteredOrders.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="text-slate-300 dark:text-slate-700 stroke-[1.5]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span>No transactions match the criteria</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
        <span>Showing {{ filteredOrders.length }} of {{ orders.length }} transactions</span>
        <span>Simulated at customizable frequency &bull; Auto-scrolling ledger</span>
      </div>

    </div>
  `
})
export class DataTableComponent implements OnChanges {
  @Input({ required: true }) orders!: any[];

  searchQuery = '';
  statusFilter = 'All';
  categoryFilter = 'All';

  categories: string[] = ['All'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orders'] && this.orders) {
      this.updateCategories();
    }
  }

  updateCategories() {
    const list = new Set(this.orders.map((o) => o.category));
    this.categories = ['All', ...Array.from(list)];
  }

  get filteredOrders() {
    if (!this.orders) return [];
    return this.orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.statusFilter === 'All' || order.status === this.statusFilter;
      const matchesCategory = this.categoryFilter === 'All' || order.category === this.categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30';
      case 'Processing':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30';
      case 'Shipped':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 dark:border-sky-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30';
    }
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }
}
