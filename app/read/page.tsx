'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

function ReadContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [titleNo, setTitleNo] = useState<string>('');

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    
    // Extract episode number and title_no from URL
    const epMatch = url.match(/episode_no=(\d+)/);
    const titleMatch = url.match(/title_no=(\d+)/);
    
    if (epMatch) {
      setCurrentEpisode(parseInt(epMatch[1]));
    }
    if (titleMatch) {
      setTitleNo(titleMatch[1]);
    }
    
    fetch(`/api/read?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [url]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to next/previous episode
  const navigateEpisode = (direction: 'next' | 'prev') => {
    if (!url || !titleNo) return;
    
    const newEpisode = direction === 'next' 
      ? currentEpisode + 1 
      : currentEpisode - 1;
    
    if (newEpisode < 1) return;
    
    // Construct new URL with updated episode number
    const baseUrl = url.replace(/&?episode_no=\d+/, '');
    const newUrl = `${baseUrl}&episode_no=${newEpisode}`;
    window.location.href = `/read?url=${encodeURIComponent(newUrl)}`;
  };

  if (!url) {
    return <div className="p-8 text-center font-mono text-[var(--color-brand-orange)] font-bold">ERROR: URL IS REQUIRED</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-t-[var(--accent)] border-transparent rounded-full animate-spin"></div>
        <div className="font-mono tracking-widest animate-pulse uppercase">DECRYPTING_COMIC_DATA...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-black min-h-screen relative">
      <div className="w-full max-w-2xl bg-neutral-900 border-x-2 border-neutral-800 pb-20">
        {images.length === 0 ? (
          <div className="p-12 text-center border-4 border-dashed border-neutral-700 m-4 font-mono text-neutral-500">
            [NO_IMAGES_RENDERED]
            <br/><br/>
            This could be a premium episode or requires app login on Webtoons.
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={`/api/image-proxy?url=${encodeURIComponent(img)}`} 
                alt={`Page ${idx + 1}`}
                className="w-full h-auto block"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-white text-black border-4 border-black hover:bg-[var(--accent)] hover:-translate-y-1 transition-all z-50 shadow-[4px_4px_0_rgba(204,255,0,1)]"
      >
        <ArrowUpCircle size={32} />
      </button>

    </div>
  );
}

export default function ReadPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  // Extract current episode from URL for header
  const getCurrentEpisode = () => {
    if (!url) return 0;
    const match = url.match(/episode_no=(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const currentEpisode = getCurrentEpisode();

  const navigateEpisode = (direction: 'next' | 'prev') => {
    if (!url) return;
    
    const newEpisode = direction === 'next' 
      ? currentEpisode + 1 
      : currentEpisode - 1;
    
    if (newEpisode < 1) return;
    
    const baseUrl = url.replace(/&?episode_no=\d+/, '');
    const newUrl = `${baseUrl}&episode_no=${newEpisode}`;
    window.location.href = `/read?url=${encodeURIComponent(newUrl)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* HEADER with navigation buttons */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm p-2 md:p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => window.history.back()} className="p-2 bg-transparent hover:bg-[var(--accent)] hover:text-black text-white transition-colors border-2 border-transparent hover:border-[var(--accent)]">
            <ArrowLeft size={24} />
          </button>
          
          <span className="font-black uppercase tracking-widest text-[var(--accent)] text-sm md:text-base whitespace-nowrap">
            READER_MODULE
          </span>

          {/* Navigation Buttons in Header */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <button 
              onClick={() => navigateEpisode('prev')}
              disabled={currentEpisode <= 1}
              className={`flex items-center gap-1 border-2 px-3 py-1.5 text-xs font-black uppercase transition-all ${
                currentEpisode > 1 
                  ? 'border-white text-white hover:bg-white hover:text-black' 
                  : 'border-neutral-700 text-neutral-700 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={16} />
              PREV
            </button>
            
            <button 
              onClick={() => navigateEpisode('next')}
              className="flex items-center gap-1 border-2 border-[var(--accent)] text-[var(--accent)] px-3 py-1.5 text-xs font-black uppercase hover:bg-[var(--accent)] hover:text-black transition-all"
            >
              NEXT
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Episode info below READER_MODULE */}
        <div className="flex justify-start pl-14">
          <span className="font-mono text-xs text-[var(--accent)] tracking-wider">
            EP {currentEpisode || '?'}
          </span>
        </div>
      </header>
      
      <main className="flex-1 w-full flex-col">
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-mono animate-pulse text-[var(--accent)]">[INITIALIZING_VIEWER]</div>}>
          <ReadContent />
        </Suspense>
      </main>
    </div>
  );
            }
