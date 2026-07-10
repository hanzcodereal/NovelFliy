'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Heart, Clock, Users } from 'lucide-react';

function DetailContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  const [detail, setDetail] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(`/api/episodes?url=${encodeURIComponent(url)}&page=1`)
      .then(res => res.json())
      .then(data => {
        setDetail(data);
        setEpisodes(data.episodesList || []);
        setHasMore(data.hasNext);
        setPage(1);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [url]);

  const loadMore = () => {
    if (!url || !hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    fetch(`/api/episodes?url=${encodeURIComponent(url)}&page=${nextPage}`)
      .then(res => res.json())
      .then(data => {
        setEpisodes(prev => [...prev, ...(data.episodesList || [])]);
        setHasMore(data.hasNext);
        setPage(nextPage);
        setLoadingMore(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingMore(false);
      });
  };

  if (!url) {
    return <div className="p-8 text-center font-mono text-red-500 uppercase font-bold border-4 border-red-500">ERROR: NO_URL_PROVIDED</div>;
  }

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-8">
        <div className="h-64 bg-neutral-900 border-4 border-neutral-700"></div>
        <div className="h-8 w-1/2 bg-neutral-900"></div>
        <div className="h-4 w-3/4 bg-neutral-900"></div>
      </div>
    );
  }

  if (!detail) {
    return <div className="p-8 text-center font-mono border-4 border-dashed uppercase text-neutral-500">FAILED TO FETCH DATA</div>;
  }

  return (
    <div className="flex flex-col gap-8 flex-1">
      {/* HEADER INFO */}
      <div className="bg-neutral-900 border-4 border-white p-4 relative overflow-hidden flex flex-col md:flex-row gap-6">
        
        <div className="w-48 aspect-[3/4] shrink-0 border-4 border-black relative mx-auto md:mx-0 z-10 bg-black">
          {detail.thumbnail ? (
            <Image 
              src={`/api/image-proxy?url=${encodeURIComponent(detail.thumbnail)}`} 
              alt={detail.title} 
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-neutral-600">NO_IMAGE</div>
          )}
        </div>

        <div className="flex flex-col flex-1 z-10 items-center md:items-start text-center md:text-left">
          {/* Badge */}
          <div className="bg-[var(--accent)] text-black px-2 py-1 font-bold font-mono text-xs inline-block mb-3 uppercase">
            {detail.status || 'UNKNOWN'}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black uppercase mb-2 leading-none">{detail.title}</h1>
          <p className="font-mono text-neutral-400 mb-4">{detail.author}</p>
          
          {/* Stats Bar */}
          <div className="bg-black border-2 border-white flex flex-wrap mb-4 w-full md:w-auto">
            {detail.genre && (
              <div className="p-2 border-r-2 border-white flex items-center gap-1">
                <span className="font-bold text-xs uppercase">{detail.genre}</span>
              </div>
            )}
            {detail.rating && (
              <div className="p-2 border-r-2 border-white flex items-center gap-1 text-[var(--accent)]">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-xs">{detail.rating}</span>
              </div>
            )}
            {detail.subscribers && (
              <div className="p-2 border-r-2 border-white flex items-center gap-1 text-[var(--color-brand-blue)]">
                <Users size={16} />
                <span className="font-bold text-xs">{detail.subscribers}</span>
              </div>
            )}
            {detail.day && (
              <div className="p-2 flex items-center gap-1 text-[var(--color-brand-orange)]">
                <Clock size={16} />
                <span className="font-bold text-xs uppercase">{detail.day}</span>
              </div>
            )}
          </div>

          <p className="text-sm border-l-4 border-[var(--color-brand-pink)] pl-4 text-neutral-300">
            {detail.synopsis}
          </p>
        </div>
      </div>

      {/* EPISODE LIST */}
      <div className="flex-1 pb-4">
        <div className="border-b-4 border-white mb-4 flex justify-between items-end pb-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">Episodes</h2>
          <span className="font-mono text-sm bg-white text-black px-2">{detail.count} Total</span>
        </div>

        <div className="flex flex-col gap-2">
          {episodes.map((ep: any, idx: number) => (
            <Link 
              key={idx}
              href={`/read?url=${encodeURIComponent(ep.url)}`}
              className="flex items-center gap-4 border-2 border-neutral-800 bg-neutral-900 hover:border-white hover:bg-black transition-colors p-2 group"
            >
              <div className="w-20 aspect-video bg-black relative border border-neutral-700 shrink-0">
                {ep.thumbnail && (
                  <Image 
                    src={`/api/image-proxy?url=${encodeURIComponent(ep.thumbnail)}`} 
                    alt={ep.title} 
                    fill
                    unoptimized
                    className="object-cover opacity-80 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal transition-all"
                  />
                )}
                <div className="absolute top-0 left-0 bg-[var(--accent)] text-black font-black text-xs px-1">
                  #{ep.episodeNo}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold uppercase truncate group-hover:text-[var(--accent)] transition-colors">{ep.title}</h3>
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 mt-1">
                  <span>{ep.date}</span>
                  {ep.likes && <span className="flex items-center gap-1 text-[var(--color-brand-pink)]"><Heart size={10} fill="currentColor"/> {ep.likes}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <button 
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full mt-6 border-4 border-white py-4 font-black uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? 'LOADING...' : 'LOAD MORE EPISODES'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b-4 border-white p-4 flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-2 border-2 border-white hover:bg-white hover:text-black transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="font-mono bg-[var(--accent)] text-black px-2 font-bold uppercase text-xl">DETAIL_VIEW</span>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:pt-8 flex flex-col">
        <Suspense fallback={<div className="font-mono text-center animate-pulse p-8">[LOADING_DATA]</div>}>
          <DetailContent />
        </Suspense>
      </main>
    </div>
  );
            }
