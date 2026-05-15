import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CAT_INFO } from "./constants";
import { Camera, Heart, Info, Clock, Plus, Trash2 } from "lucide-react";

// --- Components ---

function HeartBurst({ x, y, id, onComplete }: { x: number, y: number, id: number, onComplete: (id: number) => void, key?: number }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, scale: 0, x, y }}
      animate={{ 
        opacity: [1, 1, 0], 
        scale: [0.5, 1.5, 1],
        x: x + (Math.random() - 0.5) * 600, 
        y: y - 500 - Math.random() * 300,
        rotate: (Math.random() - 0.5) * 120
      }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="fixed pointer-events-none z-[100] text-red-500 drop-shadow-xl"
    >
      <Heart fill="currentColor" size={24 + Math.random() * 48} />
    </motion.div>
  );
}

export default function App() {
  const [hearts, setHearts] = useState<{ id: number, x: number, y: number }[]>([]);
  const [galleryImages, setGalleryImages] = useState(CAT_INFO.gallery);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const spawnHearts = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Handle both mouse and touch events
    const clientX = 'clientX' in e ? e.clientX : (e as React.TouchEvent).touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : (e as React.TouchEvent).touches[0].clientY;
    
    const newHearts = Array.from({ length: 5 }).map(() => ({
      id: Math.random(),
      x: clientX - 16,
      y: clientY - 16
    }));
    setHearts(prev => [...prev, ...newHearts]);
  }, []);

  const removeHeart = (id: number) => {
    setHearts(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen selection:bg-olive-drab/20 overflow-x-hidden">
      <Navigation />
      
      <AnimatePresence>
        {hearts.map((h: { id: number, x: number, y: number }) => (
          <HeartBurst key={h.id} id={h.id} x={h.x} y={h.y} onComplete={removeHeart} />
        ))}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-32">
        <Hero sectionId="home" onBoop={spawnHearts} />
        <Profile sectionId="about" />
        <GallerySlider 
          sectionId="gallery" 
          images={galleryImages} 
          onSelect={(url) => setSelectedImage(url)}
        />
        <Timeline sectionId="history" />
      </main>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90%] max-h-[80%] flex items-center justify-center"
            >
              <img 
                src={selectedImage}
                alt="Full view"
                className="max-w-full max-h-[60vh] sm:max-h-[75vh] object-contain rounded-xl shadow-2xl border-2 border-white/5"
                referrerPolicy="no-referrer"
              />
              <button 
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <Plus size={28} className="rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 text-center text-stone-400 text-xs font-sans uppercase tracking-[0.2em] border-t border-stone-100 italic">
        Thế giới của {CAT_INFO.name} &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Navigation() {
  const items = [
    { label: "Trang Chủ", id: "home", icon: Heart },
    { label: "Tiểu sử", id: "about", icon: Info },
    { label: "Thư Viện Ảnh", id: "gallery", icon: Camera },
    { label: "Đường đời", id: "history", icon: Clock },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-warm-beige/90 backdrop-blur-xl border-b border-stone-100 py-4">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-serif italic font-medium text-stone-800"
        >
          {CAT_INFO.name}
        </motion.span>
        <div className="flex gap-4 sm:gap-8">
          {items.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className="text-stone-500 hover:text-olive-drab transition-colors font-sans text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5"
            >
              <item.icon size={12} strokeWidth={3} />
              <span className="hidden sm:inline-block">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero({ sectionId, onBoop }: { sectionId: string, onBoop: (e: React.MouseEvent) => void }) {
  return (
    <section id={sectionId} className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center lg:min-h-[75vh] pt-4">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-8 order-2 lg:order-1"
      >
        <div className="space-y-4 text-center lg:text-left">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-stone-500 font-black block"
          >
            Tổng tài nạnh nùng đuýt thúi
          </motion.span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight">
            Chào các vợ,<br />anh là <span className="italic font-normal text-olive-drab">{CAT_INFO.vietnameseName}</span>
          </h1>
        </div>
        
        <p className="text-lg sm:text-xl text-stone-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light text-center lg:text-left italic">
          "{CAT_INFO.personality}"
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center lg:justify-start">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBoop}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-500 text-white shadow-xl shadow-red-100 flex flex-col items-center justify-center gap-1 group transition-all shrink-0"
          >
            <Heart fill="white" size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase tracking-wider font-black text-center leading-none">Thả Tym</span>
          </motion.button>
          
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-2 border-warm-beige bg-stone-200 overflow-hidden shadow-md">
                 <img src={CAT_INFO.gallery[i % CAT_INFO.gallery.length].url} alt="" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
               </div>
             ))}
             <div className="w-10 h-10 rounded-full border-2 border-warm-beige bg-stone-800 flex items-center justify-center text-white text-[8px] font-bold shadow-md">
               +99
             </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative order-1 lg:order-2 flex justify-center w-full"
      >
        <div className="relative group/hero">
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [-1, 1, -1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="aspect-square w-[280px] sm:w-[420px] lg:w-[500px] overflow-hidden rounded-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] relative z-10 border-[8px] sm:border-[16px] border-white ring-1 ring-stone-100"
          >
            <img 
              src="/images/muoi8.jfif?q=80&w=1920&auto=format&fit=crop" 
              alt="Majestic Cat"
              className="w-full h-full object-cover object-[50%_70%] grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <motion.div 
            animate={{ rotate: [-12, -8, -12], y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-2 -left-4 sm:-bottom-6 sm:-left-8 w-24 h-24 sm:w-36 sm:h-36 bg-stone-900 rounded-full flex items-center justify-center text-white text-center p-4 text-[9px] sm:text-xs font-sans uppercase tracking-[0.3em] shadow-2xl z-20 border-4 border-warm-beige leading-relaxed"
          >
            M-Meow <br/>Muối Buồn
          </motion.div>

          <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-20 sm:h-20 bg-olive-drab rounded-full rotate-12 z-0 opacity-20 blur-2xl" />
        </div>
      </motion.div>
    </section>
  );
}

function Profile({ sectionId }: { sectionId: string }) {
  return (
    <section id={sectionId} className="space-y-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-sans text-[10px] uppercase tracking-widest text-olive-drab font-bold opacity-60">Insight</span>
        <h2 className="text-4xl sm:text-6xl font-normal italic">Stalk bổn đại meow à ?!?</h2>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 sm:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="soft-card p-10 sm:p-12 space-y-12 h-full flex flex-col justify-center bg-stone-50/50 border-stone-200/50">
            <h3 className="text-2xl italic border-b border-stone-200/50 pb-6 font-medium">Bản thảo lý lịch</h3>
            <div className="space-y-8">
              {[
                { label: "Giống loài", val: CAT_INFO.breed },
                { label: "Tuổi đời", val: CAT_INFO.age },
                { label: "Ngủ", val: `${CAT_INFO.stats.sleep}h/ngày` },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-stone-100 pb-3">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black">{stat.label}</span>
                  <span className="text-xl sm:text-2xl font-light text-stone-700">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 soft-card p-10 sm:p-12 space-y-10 group">
          <h3 className="text-3xl italic">Meow-chan thích gì ?</h3>
          <div className="grid sm:grid-cols-2 gap-8">
            {CAT_INFO.hobbies.map((hobby, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-3 group/item"
              >
                <div className="h-0.5 bg-stone-100 w-8 group-hover/item:w-full group-hover/item:bg-olive-drab transition-all duration-700" />
                <p className="text-xl sm:text-2xl text-stone-600 leading-tight italic font-light">{hobby}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySlider({ sectionId, images, onSelect }: { 
  sectionId: string, 
  images: typeof CAT_INFO.gallery,
  onSelect: (url: string) => void
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id={sectionId} className="space-y-12">
      <div className="flex justify-between items-center px-4 sm:px-0">
        <div className="space-y-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Album Kỷ Niệm</span>
          <h2 className="text-4xl sm:text-5xl italic font-light text-stone-800">Nhật ký của Muối</h2>
        </div>
      </div>

      <div 
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-8 px-4 sm:px-0 scroll-smooth snap-x snap-mandatory"
        >
          {images.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-[180px] sm:w-[240px] aspect-square rounded-full overflow-hidden bg-stone-100 shrink-0 relative snap-center shadow-lg hover:shadow-xl transition-all duration-500 group/image cursor-zoom-in border-4 border-white ring-1 ring-stone-100"
              onClick={() => onSelect(item.url)}
            >
              <img 
                src={item.url} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay for caption */}
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                <p className="text-white text-xs sm:text-sm italic font-light tracking-wide leading-tight px-4">{item.caption}</p>
              </div>
            </motion.div>
          ))}
          
          <style dangerouslySetInnerHTML={{ __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          ` }} />
        </div>
      </div>
    </section>
  );
}

function Timeline({ sectionId }: { sectionId: string }) {
  return (
    <section id={sectionId} className="space-y-24 max-w-4xl mx-auto px-4 py-20 relative">
      <div className="text-center space-y-6">
        <h2 className="text-5xl sm:text-6xl italic">Hành Trình Trưởng Thành</h2>
        <div className="h-0.5 w-20 bg-stone-800 mx-auto opacity-20" />
      </div>
      
      <div className="space-y-24 relative z-10">
        {CAT_INFO.timeline.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`flex flex-col sm:flex-row items-center gap-8 sm:gap-20 text-center sm:text-left ${i % 2 === 0 ? '' : 'sm:flex-row-reverse sm:text-right'}`}
          >
            <div className="flex-1 space-y-4">
               <div className="text-5xl sm:text-7xl font-serif text-olive-drab/20 italic font-black">{item.year}</div>
               <div className="text-2xl sm:text-3xl text-stone-700 font-light leading-snug">{item.event}</div>
            </div>
            <div className="hidden sm:block w-px h-24 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-100" />
            <div className="flex-1 text-stone-300 font-sans text-xs uppercase tracking-[0.5em] font-black opacity-30">
               Chapter {i + 1}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] sm:text-[25rem] font-serif italic text-stone-100/50 -z-0 pointer-events-none whitespace-nowrap overflow-hidden w-full text-center">
        {CAT_INFO.name}
      </div>
    </section>
  );
}