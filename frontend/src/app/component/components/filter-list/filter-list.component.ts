import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { OnChanges, OnDestroy, OnInit, SimpleChanges, signal } from '@angular/core';
import { mapListResponse } from './filter-list-api-data';

export interface ListOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-list-api',
  standalone: true,
  styleUrls: ['./filter-list.component.css'],
  template: `
    <div class="filter-list">
      <button
        type="button"
        class="filter-trigger"
        [attr.aria-label]="label"
        [attr.aria-expanded]="expanded"
        (click)="toggle()"
      >
        <span>{{ summary() }}</span
        ><span>⌄</span>
      </button>
      @if (selectedIds.length) {
        <div class="selected-options" aria-live="polite" aria-label="已選項目">
          @for (id of selectedIds; track id) {
            <button type="button" (click)="remove(id)" [attr.aria-label]="'移除 ' + name(id)">
              {{ name(id) }} ×
            </button>
          }
        </div>
      }
      @if (expanded) {
        <div class="filter-menu">
          <input
            type="search"
            [name]="searchKeys.join(',')"
            [value]="query"
            (input)="onInput($event)"
            (keydown.enter)="submitSearch($event)"
            [attr.aria-label]="'搜尋' + label"
            [placeholder]="'搜尋' + label + '...'"
            (keydown.escape)="$event.stopPropagation(); expanded = false"
          />
          <div class="api-state" aria-live="polite">
            @if (loading()) {
              <p>載入中...</p>
            }
            @if (error()) {
              <p role="alert">{{ error() }}</p>
              <button type="button" (click)="loadPage(failedPage)">重新載入</button>
            }
          </div>
          <div class="filter-options" [attr.aria-label]="label + '選項'">
            @for (option of filtered(); track option.value) {
              <button
                type="button"
                [class.is-selected]="selectedIds.includes(option.value)"
                [attr.aria-pressed]="selectedIds.includes(option.value)"
                (click)="choose(option.value)"
              >
                <span
                  ><b>{{ option.label }}</b
                  ><small>{{ option.value }}</small></span
                ><span>{{ selectedIds.includes(option.value) ? '✓' : '＋' }}</span>
              </button>
            } @empty {
              @if (!loading() && !error()) {
                <p class="filter-empty">搵唔到符合條件嘅選項</p>
              }
            }
          </div>
          @if (hasMore() && !error()) {
            <button
              type="button"
              class="load-more"
              [disabled]="loading()"
              (click)="loadPage(page + 1)"
            >
              載入更多
            </button>
          }
          <div class="filter-menu-footer">
            <small>{{ filtered().length }} 個選項</small
            ><button type="button" (click)="clear()">清除選擇</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class FilterListApi implements OnChanges, OnInit, OnDestroy {
  @Input() apiUrl = '/sys/user/list';
  @Input({ required: true }) searchDataKey: string | string[] = '';
  @Input() requestBody: Record<string, unknown> = { page: 1, limit: 10 };
  @Input() postApi?: (url: string, body: Record<string, unknown>) => Promise<unknown>;
  @Input() mapResponse: (response: unknown) => ListOption[] = mapListResponse;
  @Input() value: string[] = [];
  @Input() singleValue: string | null = null;
  @Input() label = '';
  @Input() multiple = false;
  @Output() valueChange = new EventEmitter<string[]>();
  @Output() singleValueChange = new EventEmitter<string>();

  loading = signal(false);
  error = signal('');
  hasMore = signal(false);
  options = signal<ListOption[]>([]);
  expanded = false;
  query = '';
  page = 0;
  failedPage = 1;
  private initialized = false;
  private destroyed = false;
  private version = 0;
  private searchTimer?: ReturnType<typeof setTimeout>;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private names = new Map<string, string>();
  private element = inject(ElementRef);

  ngOnInit() {
    this.initialized = true;
    this.readQuery();
    void this.reload();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.initialized &&
      ['apiUrl', 'requestBody', 'postApi', 'mapResponse', 'searchDataKey'].some(
        (key) => changes[key],
      )
    ) {
      this.readQuery();
      this.names.clear();
      void this.reload();
    }
  }

  get searchKeys(): string[] {
    const keys = Array.isArray(this.searchDataKey) ? this.searchDataKey : [this.searchDataKey];
    return [...new Set(keys.map((key) => key.trim()).filter(Boolean))];
  }

  private readQuery() {
    const values = this.searchKeys.map((key) => this.requestBody[key]);
    this.query =
      values.find((value): value is string => typeof value === 'string' && value.length > 0) ?? '';
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded && this.page === 0 && !this.loading()) void this.reload();
  }

  onInput(event: Event) {
    this.search((event.target as HTMLInputElement).value);
  }

  search(query: string) {
    this.query = query;
    clearTimeout(this.searchTimer);
    ++this.version;
    this.options.set([]);
    this.page = 0;
    this.hasMore.set(false);
    this.error.set('');
    this.loading.set(true);
    this.searchTimer = setTimeout(() => void this.loadPage(1), 300);
  }

  submitSearch(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.query = (event.target as HTMLInputElement).value;
    void this.reload();
  }

  async reload() {
    clearTimeout(this.searchTimer);
    this.options.set([]);
    this.page = 0;
    this.hasMore.set(false);
    await this.loadPage(1);
  }

  async loadPage(page: number) {
    clearTimeout(this.searchTimer);
    const version = ++this.version;
    this.failedPage = page;
    this.error.set('');
    if (typeof this.postApi !== 'function' || !this.apiUrl.trim()) {
      this.loading.set(false);
      this.error.set('未設定 API：請綁定 [postApi]="loadUserLists" 及 apiUrl。');
      return;
    }
    const requestedLimit = Number(this.requestBody['limit']);
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? requestedLimit : 10;
    if (!this.searchKeys.length) {
      this.loading.set(false);
      this.error.set('請設定搜尋欄位 searchDataKey。');
      return;
    }
    const filters = Object.fromEntries(this.searchKeys.map((key) => [key, this.query.trim()]));
    const body = { ...this.requestBody, ...filters, page, limit };
    this.loading.set(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Invoke the parent's async callback directly. No HttpClient registration required.
      const request = this.postApi(this.apiUrl, body);
      const result = await Promise.race([
        request,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('API 請求逾時，請重試。')), 15000);
          this.timers.add(timer);
        }),
      ]);
      if (version !== this.version || this.destroyed) return;
      if (result === undefined) throw new Error('父元件函數必須 return 選項陣列或 API 回應。');
      let rows: ListOption[];
      try {
        rows = this.mapResponse(result);
        if (
          !Array.isArray(rows) ||
          rows.some((row) => !row || typeof row.value !== 'string' || typeof row.label !== 'string')
        ) {
          throw new Error('Invalid options');
        }
      } catch {
        throw new Error('選項格式錯誤：請回傳 { value, label }[]，或設定 mapResponse。');
      }
      rows.forEach((row) => this.names.set(row.value, row.label));
      this.options.set(
        Array.from(
          new Map(
            [...(page === 1 ? [] : this.options()), ...rows].map((row) => [row.value, row]),
          ).values(),
        ),
      );
      this.page = page;
      this.hasMore.set(rows.length >= limit);
    } catch (error) {
      if (version === this.version && !this.destroyed) {
        this.error.set(error instanceof Error ? error.message : '選項載入失敗，請重試。');
      }
    } finally {
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(timer);
      }
      if (version === this.version && !this.destroyed) this.loading.set(false);
    }
  }

  filtered() {
    return this.options();
  }
  name(id: string) {
    this.options();
    return this.names.get(id) || id;
  }
  get selectedIds(): string[] {
    if (this.multiple) return this.value;
    return this.singleValue !== null
      ? this.singleValue
        ? [this.singleValue]
        : []
      : this.value.slice(0, 1);
  }
  summary() {
    return this.selectedIds.length
      ? this.selectedIds.map((id) => this.name(id)).join('、')
      : '請選擇' + this.label;
  }
  choose(id: string) {
    if (this.multiple) {
      this.valueChange.emit(
        this.value.includes(id) ? this.value.filter((value) => value !== id) : [...this.value, id],
      );
    } else {
      this.singleValueChange.emit(id);
      this.valueChange.emit([id]);
      this.expanded = false;
    }
  }
  clear() {
    if (!this.multiple) this.singleValueChange.emit('');
    this.valueChange.emit([]);
    this.expanded = false;
  }
  remove(id: string) {
    if (!this.multiple) {
      this.clear();
      return;
    }
    this.valueChange.emit(this.value.filter((value) => value !== id));
  }

  @HostListener('document:click', ['$event']) outside(event: MouseEvent) {
    if (!this.element.nativeElement.contains(event.target)) this.expanded = false;
  }

  ngOnDestroy() {
    this.destroyed = true;
    ++this.version;
    clearTimeout(this.searchTimer);
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}
