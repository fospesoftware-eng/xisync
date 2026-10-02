type QueryResult = { data: any; error: Error | null };
type Filter = { field: string; value: unknown };

type QueryAction = 'select' | 'insert' | 'update' | 'delete';

class WorkspaceQuery implements PromiseLike<QueryResult> {
  private action: QueryAction = 'select';
  private filters: Filter[] = [];
  private orderBy: string | undefined;
  private ascending = true;
  private rowLimit: number | undefined;
  private payload: unknown;
  private asSingle = false;

  constructor(private readonly table: string) {}

  select(_columns = '*') {
    if (this.action === 'select') this.action = 'select';
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ field, value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderBy = field;
    this.ascending = options?.ascending ?? true;
    return this;
  }

  limit(value: number) {
    this.rowLimit = value;
    return this;
  }

  insert(values: unknown) {
    this.action = 'insert';
    this.payload = values;
    return this;
  }

  update(values: unknown) {
    this.action = 'update';
    this.payload = values;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  single() {
    this.asSingle = true;
    return this;
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResult> {
    try {
      const query = new URLSearchParams();
      if (this.filters.length) query.set('filters', JSON.stringify(this.filters));
      if (this.orderBy) {
        query.set('order', this.orderBy);
        query.set('ascending', String(this.ascending));
      }
      if (this.rowLimit) query.set('limit', String(this.rowLimit));
      const url = `/api/xisync/data/${encodeURIComponent(this.table)}${query.size ? `?${query}` : ''}`;
      const method = { select: 'GET', insert: 'POST', update: 'PATCH', delete: 'DELETE' }[this.action];
      const suffix = this.action === 'delete' && this.filters.find((filter) => filter.field === 'id')
        ? `?id=${encodeURIComponent(String(this.filters.find((filter) => filter.field === 'id')?.value))}`
        : '';
      const data = await fetch(`${this.action === 'delete' ? url.split('?')[0] + suffix : url}`, {
        method,
        credentials: 'include',
        headers: this.payload ? { 'Content-Type': 'application/json' } : undefined,
        body: this.payload === undefined
          ? undefined
          : JSON.stringify(this.action === 'update'
            ? { ...(this.payload as Record<string, unknown>), id: this.filters.find((filter) => filter.field === 'id')?.value }
            : this.payload),
      }).then(async (response) => {
        const result: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          const message = result && typeof result === 'object' && 'error' in result
            ? String((result as { error: unknown }).error)
            : `XiSync request failed (${response.status}).`;
          throw new Error(message);
        }
        return result;
      });
      const normalized = this.asSingle && Array.isArray(data) ? data[0] ?? null : data;
      return { data: normalized, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('XiSync request failed.') };
    }
  }
}

export const xisyncDb = {
  from(table: string) {
    return new WorkspaceQuery(table);
  },
};