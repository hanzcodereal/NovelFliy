'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Flame, Bell } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/trending?day=trending')
      .then(res => res.json())
      .then(data => {
        setTrending(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b-4 border-white pt-safe pb-4 px-4 items-end flex justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[var(--accent)] uppercase drop-shadow-[0_0_10px_rgba(204,255,0,0.5)] mt-4">
            Novel<br/>Fliy
          </h1>
          <p className="text-xs font-mono lowercase tracking-widest opacity-80 mt-1">/source_webtoons/</p>
        </div>
        <button className="h-10 w-10 border-2 border-[var(--color-brand-pink)] flex items-center justify-center text-[var(--color-brand-pink)] hover:bg-[var(--color-brand-pink)] hover:text-black transition-colors relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-3 h-3 bg-[var(--color-brand-green)] border-2 border-black rounded-full animate-ping"></span>
          <span className="absolute top-2 right-2 w-3 h-3 bg-[var(--color-brand-green)] border-2 border-black rounded-full"></span>
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-8">
        
        {/* SEARCH */}
        <section>
          <div className="flex border-4 border-white bg-black focus-within:border-[var(--accent)] transition-colors">
            <input 
              type="text" 
              placeholder="CARI WEBTOON..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="w-full bg-transparent text-white font-mono p-4 outline-none placeholder:text-gray-600"
            />
            <Link 
              href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
              className="p-4 bg-white text-black flex items-center justify-center hover:bg-[var(--accent)] transition-colors"
            >
              <Search size={24} className="font-bold" />
            </Link>
          </div>
        </section>

        {/* TRENDING */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-2 border-white pb-2 mb-2">
            <Flame className="text-[var(--color-brand-orange)]" size={28} />
            <h2 className="text-3xl font-black uppercase">Trending NOW</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[3/4] bg-neutral-900 border-2 border-neutral-700 animate-pulse"></div>
              ))}
            </div>
          ) : trending.length === 0 ? (
            <div className="p-8 border-4 border-dashed border-gray-600 font-mono text-center text-gray-500">
              [NO TRENDING DATA FOUND]
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
              {trending.map((item, idx) => (
                <Link 
                  key={idx} 
                  href={`/detail?url=${encodeURIComponent(item.url)}`}
                  className="group relative border-2 border-transparent hover:border-[var(--accent)] transition-all overflow-hidden bg-neutral-900"
                >
                  <div className="aspect-[3/4] relative">
                    {item.thumbnail ? (
                      <Image 
                        src={`/api/image-proxy?url=${encodeURIComponent(item.thumbnail)}`} 
                        alt={item.title} 
                        fill
                        unoptimized
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center font-mono text-xs opacity-50">NO_IMG</div>
                    )}
                    <div className="absolute top-0 right-0 bg-white text-black font-black p-2 text-xl translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                      #{idx + 1}
                    </div>
                  </div>
                  <div className="p-2 border-t-2 border-neutral-800 group-hover:border-[var(--accent)] bg-black">
                    <h3 className="font-bold line-clamp-1 group-hover:text-[var(--accent)] uppercase">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] font-mono bg-white text-black px-1 uppercase">{item.genre || 'UNKNOWN'}</span>
                      {item.likes && <span className="text-[10px] font-mono text-[var(--color-brand-pink)]">{item.likes} LIKES</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
      
      {/* FOOTER */}
      <footer className="mt-8 border-t-4 border-white pt-6 pb-24 md:pb-6 text-center flex flex-col items-center justify-center gap-2">
        <div className="font-mono text-sm opacity-60">DATA DARI WEBTOONS API</div>
        <div className="font-black uppercase tracking-widest text-[var(--accent)] text-lg">
          HANZZ CODEE
        </div>
        <div className="font-mono text-xs opacity-50 mt-1">© 2026 NOVELFLIY PROJECT</div>
      </footer>
      
      {/* MOBILE NAV BOTTOM (Brutalist) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t-4 border-white flex z-50 h-14">
        <Link href="/" className="flex-1 flex flex-col items-center justify-center bg-[var(--accent)] text-black transition-colors border-r-2 border-white">
          <span className="font-bold text-sm uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/search" className="flex-1 flex flex-col items-center justify-center hover:bg-[var(--color-brand-blue)] hover:text-black transition-colors border-l-2 border-white text-white">
          <span className="font-bold text-sm uppercase tracking-widest">Search</span>
        </Link>
      </nav>
    </div>
  );
        }
