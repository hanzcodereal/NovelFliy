'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(!!initialQ);

  const fetchResults = (q: string) => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (initialQ) {
      fetchResults(initialQ);
    }
  }, [initialQ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(query.trim()) {
      window.history.replaceState({}, '', `/search?q=${encodeURIComponent(query)}`);
      fetchResults(query);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex border-4 border-white bg-black focus-within:border-[var(--color-brand-blue)] transition-colors">
        <input 
          type="text" 
          placeholder="SEARCH QUERY..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-white font-mono p-4 outline-none placeholder:text-gray-600"
          autoFocus={!initialQ}
        />
        <button 
          type="submit"
          className="p-4 bg-white text-black flex items-center justify-center hover:bg-[var(--color-brand-blue)] transition-colors"
        >
          <SearchIcon size={24} className="font-bold" />
        </button>
      </form>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-neutral-900 border-2 border-neutral-700 animate-pulse"></div>
          ))}
        </div>
      ) : results ? (
        <div className="flex flex-col gap-8">
          <div className="font-mono font-bold border-b-2 border-white pb-2 flex justify-between uppercase">
            <span>RESULTS FOR "{results.query}"</span>
            <span className="bg-white text-black px-2">{results.count} FOUND</span>
          </div>
          
          {results.items?.length === 0 && (
            <div className="p-8 text-center border-4 border-dashed border-gray-700 text-gray-500 font-mono">
              [EMPTY_SET]
            </div>
          )}

          <div className="flex flex-col gap-4">
            {results.items?.map((item: any, idx: number) => (
              <Link 
                key={idx}
                href={`/detail?url=${encodeURIComponent(item.url)}`}
                className="flex gap-4 border-4 border-neutral-800 bg-black hover:border-[var(--color-brand-blue)] transition-colors group p-2"
              >
                <div className="w-24 md:w-32 aspect-[3/4] bg-neutral-900 relative border-2 border-neutral-700 shrink-0">
                  {item.thumbnail && (
                    <Image 
                      src={`/api/image-proxy?url=${encodeURIComponent(item.thumbnail)}`} 
                      alt={item.title} 
                      fill
                      unoptimized
                      className="object-cover grayscale group-hover:grayscale-0"
                    />
                  )}
                </div>
                <div className="flex flex-col py-2 flex-1">
                  <h3 className="text-xl md:text-2xl font-black uppercase leading-none mb-2 group-hover:text-[var(--color-brand-blue)]">{item.title}</h3>
                  <p className="font-mono text-xs md:text-sm text-gray-400 mb-2 uppercase">{item.author || "UNKNOWN_AUTHOR"}</p>
                  <div className="mt-auto flex gap-2">
                    <span className="text-[10px] md:text-xs font-mono bg-white text-black px-2 py-1 uppercase">{item.section}</span>
                    {item.genre && (
                      <span className="text-[10px] md:text-xs font-mono border border-white px-2 py-1 uppercase">{item.genre}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b-4 border-white p-4 flex items-center gap-4">
        <Link href="/" className="p-2 border-2 border-white hover:bg-white hover:text-black transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-black tracking-tighter uppercase">SEARCH_DATA</h1>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        <Suspense fallback={<div className="p-8 text-center font-mono animate-pulse">[LOADING_SYS]</div>}>
          <SearchContent />
        </Suspense>
      </main>
      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t-4 border-white flex z-50 h-14">
        <Link href="/" className="flex-1 flex flex-col items-center justify-center hover:bg-[var(--accent)] hover:text-black transition-colors border-r-2 border-white">
          <span className="font-bold text-sm uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/search" className="flex-1 flex flex-col items-center justify-center bg-[var(--color-brand-blue)] text-black transition-colors border-l-2 border-white">
          <span className="font-bold text-sm uppercase tracking-widest">Search</span>
        </Link>
      </nav>
    </div>
  );
    }
