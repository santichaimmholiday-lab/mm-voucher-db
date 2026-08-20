import React, { useState } from 'react';
import { FilterCondition, FilterField, Operator } from '../utils/filterUtils';

interface AdvancedSearchProps {
  fields: FilterField[];
  filters: FilterCondition[];
  onChange: (filters: FilterCondition[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  fields,
  filters,
  onChange,
  isOpen,
  onToggle
}) => {
  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Math.random().toString(36).substr(2, 9),
      field: fields[0]?.id || '',
      operator: fields[0]?.type === 'text' ? 'contains' : 'equals',
      value: ''
    };
    onChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, key: keyof FilterCondition, val: any) => {
    onChange(filters.map(f => {
      if (f.id === id) {
        const updated = { ...f, [key]: val };
        // Reset operator if field type changes
        if (key === 'field') {
          const fieldType = fields.find(field => field.id === val)?.type;
          updated.operator = fieldType === 'text' ? 'contains' : 'equals';
          updated.value = '';
          updated.valueTo = '';
        }
        return updated;
      }
      return f;
    }));
  };

  const getOperatorsForType = (type: 'text' | 'date' | 'number'): { value: Operator, label: string }[] => {
    if (type === 'text') {
      return [
        { value: 'contains', label: 'Contains (มีคำว่า)' },
        { value: 'startsWith', label: 'Starts with (เริ่มต้นด้วย)' },
        { value: 'endsWith', label: 'Ends with (ลงท้ายด้วย)' },
        { value: 'equals', label: 'Equals (ตรงกับ)' },
      ];
    }
    return [
      { value: 'equals', label: 'Equals (ตรงกับ)' },
      { value: 'between', label: 'Between (ตั้งแต่ - ถึง)' },
      { value: 'gt', label: 'Greater than (>)' },
      { value: 'lt', label: 'Less than (<)' },
    ];
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={onToggle}
          className="text-sm flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className={`w-4 h-4 mr-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {isOpen ? 'Hide Advanced Search' : 'Advanced Search (ค้นหาเพิ่มเติม)'}
        </button>
        {filters.length > 0 && !isOpen && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {filters.length} active filter(s)
          </span>
        )}
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
          {filters.length === 0 ? (
            <div className="text-sm text-gray-500 italic mb-3">No advanced filters applied.</div>
          ) : (
            <div className="space-y-3 mb-3">
              {filters.map((filter) => {
                const selectedField = fields.find(f => f.id === filter.field);
                const fieldType = selectedField?.type || 'text';
                const operators = getOperatorsForType(fieldType);

                return (
                  <div key={filter.id} className="flex flex-wrap items-center gap-2 bg-white p-2 rounded border border-gray-300">
                    <select
                      value={filter.field}
                      onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                      className="border-gray-300 rounded text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {fields.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>

                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                      className="border-gray-300 rounded text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {operators.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>

                    <input
                      type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                      placeholder="Value"
                      className="border-gray-300 rounded text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-[120px]"
                    />

                    {filter.operator === 'between' && (
                      <>
                        <span className="text-gray-500 text-sm">to</span>
                        <input
                          type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
                          value={filter.valueTo || ''}
                          onChange={(e) => updateFilter(filter.id, 'valueTo', e.target.value)}
                          placeholder="To Value"
                          className="border-gray-300 rounded text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-[120px]"
                        />
                      </>
                    )}

                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove condition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={addFilter}
              className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 transition shadow-sm"
            >
              + Add Condition
            </button>
            {filters.length > 0 && (
              <button
                onClick={() => onChange([])}
                className="text-sm bg-white border border-red-300 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 transition shadow-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
