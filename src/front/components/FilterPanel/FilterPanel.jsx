import React from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { FilterAccessibility } from './FilterAccessibility';
import { FilterCategories } from './FilterCategories';

export const FilterPanel = () => {

    return (
        <div className="filter-panel d-flex flex-column gap-3 p-1">
            <FilterAccessibility />
            <FilterCategories typeView="grid" />
        </div>
    );
};
