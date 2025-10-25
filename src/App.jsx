/*
const VIDEO_DATA = [
  { 
    id: 1, 
    title: 'Cappadocia', 
    description: 'Mudah salah satu dunia yang paling terkenal balon...', 
    src: 'https://www.pexels.com/download/video/5659157/',
    location: 'Turkey',
    rating: 5.0,
    price: 'Rp. 1.799,000'
  },
  { 
    id: 2, 
    title: 'Bagan Plains', 
    description: 'Tempat sempurna untuk melihat ribuan candi.', 
    src: 'https://www.pexels.com/download/video/852320/',
    location: 'Myanmar',
    rating: 4.8,
    price: 'Rp. 1.250,000'
  },
  { 
    id: 3, 
    title: 'Albuquerque', 
    description: 'Festival Internacional de Globos Aerostáticos.', 
    src: 'https://www.pexels.com/download/video/3064203/',
    location: 'USA',
    rating: 4.5,
    price: 'Rp. 2.100,000'
  },
];
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import "./App.css";
import SwipeIndicator from './components/SwipeIndicator';

// --- CONSTANTES ---
const HIDE_TIMEOUT_DURATION = 500; // 0.5 seconds delay for center button hide
const TRANSITION_DURATION = 400; // Must match CSS transition duration

// URLs de video públicas y accesibles para garantizar la carga.
const VIDEO_DATA = [
  { 
    id: 1, 
    title: 'Cappadocia', 
    description: 'Mudah salah satu dunia yang paling terkenal balon...', 
    src: 'https://www.pexels.com/download/video/5659157/',
    location: 'Turkey',
    rating: 5.0,
    price: 'Rp. 1.799,000'
  },
  { 
    id: 2, 
    title: 'Bagan Plains', 
    description: 'Tempat sempurna untuk melihat ribuan candi.', 
    src: 'https://www.pexels.com/download/video/852320/',
    location: 'Myanmar',
    rating: 4.8,
    price: 'Rp. 1.250,000'
  },
  { 
    id: 3, 
    title: 'Albuquerque', 
    description: 'Festival Internacional de Globos Aerostáticos.', 
    src: 'https://www.pexels.com/download/video/3064203/',
    location: 'USA',
    rating: 4.5,
    price: 'Rp. 2.100,000'
  },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isSliderVisible, setIsSliderVisible] = useState(true);
  const [isCenterBtnVisible, setIsCenterBtnVisible] = useState(false); 
  const [isToggleBtnVisible, setIsToggleBtnVisible] = useState(false);
  // Nuevo estado para la traducción X del track
  const [trackTranslateX, setTrackTranslateX] = useState(0);


  // Refs for DOM elements and timeouts
  const bgVideoRef = useRef(null);
  const sliderContainerRef = useRef(null); 
  const hideTimeoutRef = useRef(null);

  const currentVideo = VIDEO_DATA[currentIndex];

  // --- HELPER FUNCTIONS ---

  const getSlideClass = (index) => {
    if (index === currentIndex) {
      return 'slide current';
    } else if (index === (currentIndex + 1) % VIDEO_DATA.length) {
      return 'slide next';
    } else {
      return 'slide hidden';
    }
  };

  const pauseCurrentSlideVideo = () => {
    const currentSlide = sliderContainerRef.current?.querySelector('.slide.current');
    if (currentSlide) {
      const slideVideo = currentSlide.querySelector('video');
      // Aseguramos que el video del slide esté pausado si no es el activo
      if (slideVideo) slideVideo.pause();
    }
  };
  
  // --- Centering Logic (Updated for precision) ---
  const calculateTrackOffset = useCallback(() => {
    const track = sliderContainerRef.current?.querySelector('.slider-track');
    const panel = document.getElementById('right-panel');

    // Estas variables de CSS definen el tamaño del slide, deben coincidir con :root
    const BASE_CARD_WIDTH = 280; 
    const SCALE_ACTIVE = 1.4;
    const SLIDE_GAP = 60;

    if (!track || !panel) return;

    // 1. Obtener el ancho de la tarjeta activa después de escalarse.
    // CSS variable: var(--scaled-active-width) = 200px * 1.8 = 360px
    const scaledActiveWidth = BASE_CARD_WIDTH * SCALE_ACTIVE;

    // 2. Calcular la posición inicial del centro del panel derecho.
    const panelCenter = panel.clientWidth / 2;

    // 3. El track renderiza los slides, pero el slide activo (order: 1) estará al principio.
    // Necesitamos mover todo el track para que el centro del slide activo caiga en el centro del panel.
    // Shift = (Centro del Panel) - (Centro del Slide Activo)
    // El centro del slide activo, si estuviera en la posición 0 del track, es scaledActiveWidth / 2.

    const requiredShift = panelCenter - (scaledActiveWidth / 2);
    
    // Aplicamos el desplazamiento. Usamos SLIDE_GAP/2 para micro-ajustar por si acaso.
    setTrackTranslateX(requiredShift);

    // Ajustar la posición del botón de navegación también
    /*
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        // Posición del botón Next debe ser: requiredShift + scaledActiveWidth + SLIDE_GAP
        const nextBtnPosition = requiredShift + scaledActiveWidth + SLIDE_GAP - (nextBtn.offsetWidth / 2);
        nextBtn.style.left = `${nextBtnPosition}px`;
    }
    */
  }, []);


  // --- TIMEOUT MANAGEMENT ---

  const startHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
    }
    // Set a timeout to hide the center button after 500ms
    hideTimeoutRef.current = setTimeout(() => {
        setIsCenterBtnVisible(false);
    }, HIDE_TIMEOUT_DURATION);
  }, []);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
    }
  }, []);

  // --- EFFECTS ---

  // 1. Sync video source and reset state on slide change
  useEffect(() => {
    const videoElement = bgVideoRef.current;
    if (videoElement && videoElement.src !== currentVideo.src) {
      videoElement.src = currentVideo.src;
      videoElement.load();
      videoElement.pause();
      
      // Reset all states when slide changes
      setIsPlaying(false);
      setIsSliderVisible(true);
      setIsCenterBtnVisible(false); 
      setIsToggleBtnVisible(false);
      
      pauseCurrentSlideVideo();
      clearHideTimeout();
    }
    // Recalculate offset when index changes to ensure proper centering
    calculateTrackOffset();
  }, [currentIndex, currentVideo.src, clearHideTimeout, calculateTrackOffset]);

  // 2. Setup resize listener for responsive centering
  useEffect(() => {
    window.addEventListener('resize', calculateTrackOffset);
    // Initial calculation on mount
    calculateTrackOffset();
    
    return () => {
        clearHideTimeout();
        window.removeEventListener('resize', calculateTrackOffset);
    }
  }, [clearHideTimeout, calculateTrackOffset]);


  // --- HANDLERS ---

  const handleNext = useCallback(() => {
    // Solo permitir navegación si el slider es visible
    if (isSliderVisible) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % VIDEO_DATA.length);
    }
  }, [isSliderVisible]);

  const handleLineClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  /**
   * Toggles play/pause for the background video.
   */
  const toggleBackgroundPlay = () => {
    const videoElement = bgVideoRef.current;
    if (videoElement) {
      if (isPlaying) {
        // PAUSE LOGIC
        videoElement.pause(); 
        setIsPlaying(false);
        setIsSliderVisible(true); // Show slider on pause
        setIsCenterBtnVisible(false); 
        setIsToggleBtnVisible(false); // Hide toggle button
        clearHideTimeout();
      } else {
        // PLAY LOGIC
        videoElement.play().catch(e => {
             console.error("Play error:", e);
             setIsPlaying(false);
             setIsSliderVisible(true);
             setIsCenterBtnVisible(true); 
             return; 
        });
        
        setIsPlaying(true);
        setIsSliderVisible(false);
        setIsToggleBtnVisible(true); // Show bottom-right toggle button
        pauseCurrentSlideVideo();
        
        setIsCenterBtnVisible(true);
        startHideTimeout();
      }
    }
  };

  /**
   * Shows center button, clears hide timer, and restarts the hide timer.
   */
  const handleMouseActivity = () => {
    if (isPlaying) {
        clearHideTimeout(); 
        setIsCenterBtnVisible(true); 
        startHideTimeout();
    }
  };

  /**
   * Hides the center button if the slider is not visible and starts the hide timer.
   */
  const handleMouseLeave = () => {
    if (isPlaying && !isSliderVisible) {
        startHideTimeout();
    }
  };
  
  /**
   * Toggles the visibility of the slider using the bottom-right button.
   */
  const toggleSliderVisibility = () => {
    const shouldBeVisible = !isSliderVisible;
    setIsSliderVisible(shouldBeVisible);
    
    if (shouldBeVisible) {
      clearHideTimeout();
      // Show center button if video is playing AND we reveal the slider
      if (isPlaying) setIsCenterBtnVisible(true);
    } else {
      startHideTimeout();
    }
  };
  
  const currentSlideVideo = VIDEO_DATA[currentIndex];

  // --- Render Functions ---

  // Renders the lower white content card (Title, Description, Price, Button)
  const renderContentCard = (video) => {
    return (
      <div className="content-card">
        {/* Text Content */}
        <div className="text-content">
          <h2 className="title">{video.title}</h2>
          <p className="description">{video.description} <span className="read-more">Baca Selengkapnya</span></p>
        </div>
         {/* Price and Button */}
         <div className="price-booking">
            <div className="price-info">
                <span className="label">Harga</span>
                <span className="value">{video.price}/<span className="unit">Orang</span></span>
            </div>
            <button className="book-btn">Pesan Tiket</button>
          </div>
      </div>
    );
  }

  // Renders the Rating and Location overlay for the video area
  const renderVideoOverlay = (video) => {
    return (
        // The video-info-overlay is ABSOLUTE inside the RELATIVE video-area
        <div className="video-info-overlay">
          <div className='video-card-positioning'>
          <div className="rating-location">
                {/* Rating Badge */}
                <div className="rating-badge">
                    <img src="/assets/rating.png" alt="rating icon" width={30} height={30} />
                    <span>{video.rating.toFixed(1)}</span>
                </div>
                {/* Location Badge */}
                <div className="location-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" className="pin-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{video.location}</span>
                </div>
            </div>
          </div>
        </div>
    );
  };


  return (
    <>
      <div id="main-app-container">
        {/* --- Global Navigation (FIXED ON TOP) --- */}
        <div className="nav-header">
            <div className="nav-logo">BALONKUN</div>
            <div className="nav-links">
                <a>Destinasi</a>
                <a>Tentang Kami</a>
                <a>Kontak Kami</a>
            </div>
            <button className="contact-btn">
              <span>Hubungi Kami</span>
              <img src="/assets/whatsapp-icon.png" alt="whatsapp icon" width={50} height={50} />
            </button>
        </div>
        
        {/* --- Left Panel (60% - Diseño Estático) --- */}
        <div id="left-panel">
            <img className='hero-elipse' src="/assets/elipse_bg.png" alt="hero elipse" />
            <div className="hero-content">
                <h1>Nikmati Liburanmu Bersama <span>BalonKUN</span> Travel</h1>
                <p>Dengan BalonKUN kamu bisa merasakan pengalaman baru dengan menaiki balon udara con la pemandangan sekitar yang sangat indah untuk memanjakan mata anda.</p>
                <div className="hero-actions">
                    <button className="gold-btn">
                        <span>Lihat Destinasi</span> 
                        <img src="/assets/chevron-right-icon.png" alt="chevron right icon" width={50} height={50} />
                    </button>
                    <a href="/" className="gallery-link">
                      <span className='glassy-btn-box'><img src="/assets/play-button.png" alt="play button" width={30} height={30} /></span>
                      <span>Galeri Kami</span>
                    </a>
                </div>
            </div>
        </div>

        {/* --- Right Panel (40% Container for Slider/Video) --- */}
        <div id="right-panel"> 
            {isSliderVisible && ( 
              <button 
                id="next-btn"
                aria-label="Next Slide" 
                onClick={handleNext}
              >
                <span className='next-btn-inner'>
                  <img src="/assets/arrow-right-icon.png" alt="next slider button" />
                </span>
              </button>
            )}
            {/* --- Background Video Player Wrapper --- */}
            <div 
              className="video-bg-player"
              onMouseEnter={handleMouseActivity} 
              onMouseMove={handleMouseActivity} 
              onMouseLeave={handleMouseLeave} 
            >
              <video 
                id="background-video" 
                ref={bgVideoRef} 
                muted 
                loop
                playsInline 
                src={currentVideo.src} 
                className={isPlaying ? 'video-playing' : 'video-paused'}
                onError={() => console.error(`Failed to load video: ${currentVideo.src}`)}
              />

              {/* Center Pause/Play Button (For the large background video) */}
              <button 
                id="center-play-pause-btn" 
                className={isCenterBtnVisible ? '' : 'hidden-btn'}
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
                onClick={toggleBackgroundPlay}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>

               {/* Botón de Siguiente (zIndex alto) - Positioned with JS in calculateTrackOffset */}

            </div>

            {/* --- Slider Toggle Button (Bottom Right) --- */}
            <button 
                id="slider-toggle-btn" 
                className={!isToggleBtnVisible ? 'hidden-btn' : ''}
                onClick={toggleSliderVisibility}
                aria-label={isSliderVisible ? "Hide Slider" : "Show Slider"}
            >
              {isSliderVisible ? 'Hide' : 'show'}
            </button>

            {/* --- Video Slider Container (Viewport for the cards) --- */}
            <div 
              className={`video-slider-container ${!isSliderVisible ? 'hidden-slider' : ''}`}
              ref={sliderContainerRef}
              style={{
                '--track-translate-x': `${trackTranslateX}px` // Pass the calculated offset to CSS variable
              }}
            >
              
              {/* Apply the translation to the track itself for centering */}
              <div 
                className="slider-track"
                style={{
                    transform: `translateX(${trackTranslateX}px)`
                }}
              >
                {VIDEO_DATA.map((video, index) => {
                  const isCurrent = index === currentIndex;

                  return (
                    <div 
                      key={video.id} 
                      className={`${getSlideClass(index)}`}
                      data-video-src={video.src}
                      onClick={() => {
                        // Allow navigation when clicking a non-active slide
                        if (index !== currentIndex) {
                          handleLineClick(index); 
                        }
                      }}
                    >
                      {/* --- Video/Image Area (Top) - Relative Parent --- */}
                      <div className="video-area">
                        <video src={video.src} muted loop /> 
                        
                        {/* Rating and Location Overlay (Absolute Child) */}
                        {renderVideoOverlay(video)}

                        
                        {/* Play/Pause Button inside slide */}
                        <button 
                          className="slide-play-btn" 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (isCurrent) {
                                // Toggle play/pause for the background video and hide/show the slider
                                toggleBackgroundPlay();
                            }
                          }}
                          // Disable button if it's not the current slide (which hides it via CSS)
                          disabled={!isCurrent} 
                          aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                        >
                          {/* Icon reflects the current background video state */}
                          {isPlaying ? <span>❚❚</span> : <span><img src="/assets/play-button.png" alt="play button" width={30} height={30} /></span>} 
                        </button>
                      </div>

                      {/* --- Content Card (Bottom) --- */}
                      {renderContentCard(video)}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Lines */}
              <div className="slider-lines">
                {VIDEO_DATA.map((_, index) => (
                  <div 
                    key={index}
                    className={`line ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => handleLineClick(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
        </div>
        
        <div className='positioning-swipe-indicator'>
          <SwipeIndicator />
        </div>
      </div>
    </>
  );
};

export default App;