'use client';

import { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import styles from './EndpointFilter.module.scss';

interface EndpointFilterProps {
  onFilterChange?: (value: string) => void;
  placeholder?: string;
}

export function EndpointFilter(props: EndpointFilterProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (props.onFilterChange) {
      props.onFilterChange(value);
    }
  };

  return (
    <div className={styles.filterWrapper}>
      <Input
        type="search"
        placeholder={props.placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        className={styles.myFilterInput}
      />
    </div>
  );
}
