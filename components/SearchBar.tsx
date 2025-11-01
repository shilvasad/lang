
import React from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <SearchIcon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="search"
        placeholder="Search phrases (e.g., 'hello', 'বিদায়')..."
        value={value}
        onChange={onChange}
        className="w-full rounded-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
