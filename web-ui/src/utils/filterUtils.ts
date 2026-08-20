export type Operator = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'between' | 'gt' | 'lt';

export interface FilterCondition {
  id: string;
  field: string;
  operator: Operator;
  value: string;
  valueTo?: string; // Used only for 'between'
}

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number';
}

export const applyAdvancedFilters = <T extends Record<string, any>>(
  data: T[],
  filters: FilterCondition[]
): T[] => {
  if (!filters || filters.length === 0) return data;

  return data.filter(item => {
    return filters.every(f => {
      if (!f.field || !f.operator || (!f.value && f.value !== '0')) return true;

      // Handle nested fields like locatype.locatype_name
      const keys = f.field.split('.');
      let val = item;
      for (const key of keys) {
        if (val === undefined || val === null) break;
        val = val[key];
      }
      
      if (val === undefined || val === null) return false;

      const strVal = String(val).toLowerCase();
      const target = f.value.toLowerCase();

      switch (f.operator) {
        case 'contains':
          return strVal.includes(target);
        case 'startsWith':
          return strVal.startsWith(target);
        case 'endsWith':
          return strVal.endsWith(target);
        case 'equals':
          return strVal === target;
        case 'between':
          if (f.value && f.valueTo) {
            const isDate = isNaN(Number(val)) && !isNaN(Date.parse(String(val)));
            if (isDate) {
              const d = new Date(val).getTime();
              // Parse user input dates (assuming YYYY-MM-DD input from date picker)
              const fromD = new Date(f.value).getTime();
              // Set 'To' date to end of day
              const toD = new Date(f.valueTo + 'T23:59:59').getTime(); 
              return d >= fromD && d <= toD;
            } else {
              return Number(val) >= Number(f.value) && Number(val) <= Number(f.valueTo);
            }
          }
          return true; // Ignore if incomplete
        case 'gt':
          if (!isNaN(Date.parse(String(val))) && isNaN(Number(val))) {
             return new Date(val).getTime() > new Date(f.value).getTime();
          }
          return Number(val) > Number(f.value);
        case 'lt':
           if (!isNaN(Date.parse(String(val))) && isNaN(Number(val))) {
             return new Date(val).getTime() < new Date(f.value).getTime();
          }
          return Number(val) < Number(f.value);
        default:
          return true;
      }
    });
  });
};
