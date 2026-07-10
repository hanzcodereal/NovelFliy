'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpCircle } from 'lucide-react';

function ReadContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
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
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* HEADER that hides when scrolling down? For now sticky. */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b-4 border-[var(--accent)] p-2 md:p-4 flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-2 bg-transparent hover:bg-[var(--accent)] hover:text-black text-white transition-colors border-2 border-transparent">
          <ArrowLeft size={24} />
        </button>
        <span className="font-black uppercase tracking-widest text-[var(--accent)]">READER_MODULE</span>
      </header>
      
      <main className="flex-1 w-full flex-col">
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-mono animate-pulse text-[var(--accent)]">[INITIALIZING_VIEWER]</div>}>
          <ReadContent />
        </Suspense>
      </main>
    </div>
  );
            }
