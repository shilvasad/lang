import React, { useState, useEffect, useMemo } from 'react';
import { phrases } from './data/phrases';
import { type Phrase } from './types';
import { useDebounce } from './hooks/useDebounce';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PhraseCard from './components/PhraseCard';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from './components/Icons';

// --- Pagination Component ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const [jumpToPage, setJumpToPage] = useState('');

  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(jumpToPage, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
        setJumpToPage('');
      } else {
        alert(`Please enter a page number between 1 and ${totalPages}.`);
        setJumpToPage('');
      }
    }
  };

  const paginationRange = useMemo(() => {
    const totalPageNumbers = 7; // Total numbers to display including ellipses
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = [currentPage - 1, currentPage, currentPage + 1];
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
    return []; // Should not happen with the logic above
  }, [currentPage, totalPages]);
  
  const handlePageSelect = (page: number | string) => {
    if (typeof page === 'number') {
        onPageChange(page);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <nav className="flex items-center justify-center space-x-1" aria-label="Pagination">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:z-20 focus:outline-offset-0"
            >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:z-20 focus:outline-offset-0"
            >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === '...') {
                    return <span key={index} className="px-2 py-2 text-slate-500">...</span>;
                }
                return (
                    <button
                        key={index}
                        onClick={() => handlePageSelect(pageNumber)}
                        className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                            ? 'bg-blue-600 text-white focus-visible:outline-blue-600'
                            : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                        } focus:z-20 focus:outline-offset-0`}
                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                );
            })}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:z-20 focus:outline-offset-0"
            >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed focus:z-20 focus:outline-offset-0"
            >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
        </nav>
        <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-600">Go to page:</span>
            <input
                type="number"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onKeyDown={handleJumpToPage}
                className="w-16 rounded-md border border-slate-300 py-1 px-2 text-center"
                min="1"
                max={totalPages}
            />
        </div>
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>(phrases);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      const results = phrases.filter(phrase =>
        phrase.bangla.toLowerCase().includes(lowercasedTerm) ||
        phrase.english.toLowerCase().includes(lowercasedTerm) ||
        phrase.italiano.toLowerCase().includes(lowercasedTerm) ||
        phrase.pronunciation.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredPhrases(results);
    } else {
      setFilteredPhrases(phrases);
    }
    setCurrentPage(1); // Reset to first page on new search
  }, [debouncedSearchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPhrases = filteredPhrases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPhrases.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header isInstallable={!!deferredPrompt} onInstallClick={handleInstallClick} />
      <main className="container mx-auto p-4 md:p-6">
        <div className="sticky top-4 z-10 mb-6">
            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        {currentPhrases.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentPhrases.map((phrase) => (
                    <PhraseCard key={phrase.id} phrase={phrase} />
                ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
            <div className="text-center py-16">
                <p className="text-slate-500 text-lg">No phrases found for "{searchTerm}".</p>
                <p className="text-slate-400 mt-2">Try searching for a different term.</p>
            </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-400 text-sm">
        <p>Created with &hearts; for language learners.</p>
      </footer>
    </div>
  );
};

export default App;