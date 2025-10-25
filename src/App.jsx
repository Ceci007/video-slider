import React, { useState, useEffect, useRef, useCallback } from 'react';
import "./App.css";
import SwipeIndicator from './components/SwipeIndicator';

const HIDE_TIMEOUT_DURATION = 500;
const TRANSITION_DURATION = 400; 

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
  const [trackTranslateX, setTrackTranslateX] = useState(0);

  const bgVideoRef = useRef(null);
  const sliderContainerRef = useRef(null); 
  const hideTimeoutRef = useRef(null);

  const currentVideo = VIDEO_DATA[currentIndex];

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
      if (slideVideo) slideVideo.pause();
    }
  };
  
  const calculateTrackOffset = useCallback(() => {
    const track = sliderContainerRef.current?.querySelector('.slider-track');
    const panel = document.getElementById('right-panel');

    const BASE_CARD_WIDTH = 280; 
    const SCALE_ACTIVE = 1.4;
    const SLIDE_GAP = 80;

    if (!track || !panel) return;

    const scaledActiveWidth = BASE_CARD_WIDTH * SCALE_ACTIVE;
    const panelCenter = panel.clientWidth / 2;
    const requiredShift = panelCenter - (scaledActiveWidth / 2);

    setTrackTranslateX(requiredShift);
  }, []);


  const startHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
    }
  
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

  useEffect(() => {
    const videoElement = bgVideoRef.current;
    if (videoElement && videoElement.src !== currentVideo.src) {
      videoElement.src = currentVideo.src;
      videoElement.load();
      videoElement.pause();
      
      setIsPlaying(false);
      setIsSliderVisible(true);
      setIsCenterBtnVisible(false); 
      setIsToggleBtnVisible(false);
      pauseCurrentSlideVideo();
      clearHideTimeout();
    }

    calculateTrackOffset();
  }, [currentIndex, currentVideo.src, clearHideTimeout, calculateTrackOffset]);

  useEffect(() => {
    window.addEventListener('resize', calculateTrackOffset);
    calculateTrackOffset();
    
    return () => {
        clearHideTimeout();
        window.removeEventListener('resize', calculateTrackOffset);
    }
  }, [clearHideTimeout, calculateTrackOffset]);

  const handleNext = useCallback(() => {
    if (isSliderVisible) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % VIDEO_DATA.length);
    }
  }, [isSliderVisible]);

  const handleLineClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const toggleBackgroundPlay = () => {
    const videoElement = bgVideoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause(); 
        setIsPlaying(false);
        setIsSliderVisible(true); 
        setIsCenterBtnVisible(false); 
        setIsToggleBtnVisible(false); 
        clearHideTimeout();
      } else {
        videoElement.play().catch(e => {
             console.error("Play error:", e);
             setIsPlaying(false);
             setIsSliderVisible(true);
             setIsCenterBtnVisible(true); 
             return; 
        });
        
        setIsPlaying(true);
        setIsSliderVisible(false);
        setIsToggleBtnVisible(true); 
        pauseCurrentSlideVideo();
        setIsCenterBtnVisible(true);
        startHideTimeout();
      }
    }
  };

  const handleMouseActivity = () => {
    if (isPlaying) {
        clearHideTimeout(); 
        setIsCenterBtnVisible(true); 
        startHideTimeout();
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && !isSliderVisible) {
        startHideTimeout();
    }
  };
  
  const toggleSliderVisibility = () => {
    const shouldBeVisible = !isSliderVisible;
    setIsSliderVisible(shouldBeVisible);
    
    if (shouldBeVisible) {
      clearHideTimeout();
      if (isPlaying) setIsCenterBtnVisible(true);
    } else {
      startHideTimeout();
    }
  };
  
  const currentSlideVideo = VIDEO_DATA[currentIndex];

  const renderContentCard = (video) => {
    return (
      <div className="content-card">
        <div className="text-content">
          <h2 className="title">{video.title}</h2>
          <p className="description">{video.description} <span className="read-more">Baca Selengkapnya</span></p>
        </div>
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

  const renderVideoOverlay = (video) => {
    return (
        <div className="video-info-overlay">
          <div className='video-card-positioning'>
            <div className="rating-location">
              <div className="rating-badge">
                  <img src="/assets/rating.png" alt="rating icon" width={30} height={30} />
                  <span>{video.rating.toFixed(1)}</span>
              </div>
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

        <div id="right-panel"> 
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
              <button 
                id="center-play-pause-btn" 
                className={isCenterBtnVisible ? '' : 'hidden-btn'}
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
                onClick={toggleBackgroundPlay}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
            </div>

            <button 
                id="slider-toggle-btn" 
                className={!isToggleBtnVisible ? 'hidden-btn' : ''}
                onClick={toggleSliderVisibility}
                aria-label={isSliderVisible ? "Hide Slider" : "Show Slider"}
            >
              {isSliderVisible ? 'Hide' : 'show'}
            </button>

            <div 
              className={`video-slider-container ${!isSliderVisible ? 'hidden-slider' : ''}`}
              ref={sliderContainerRef}
              style={{
                '--track-translate-x': `${trackTranslateX}px` 
              }}
            >
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
                        if (index !== currentIndex) {
                          handleLineClick(index); 
                        }
                      }}
                    >
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
                      <div className="video-area">
                        <video src={video.src} muted loop /> 
                        {renderVideoOverlay(video)}
                        <button 
                          className="slide-play-btn" 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            if (isCurrent) {
                                toggleBackgroundPlay();
                            }
                          }}
                          disabled={!isCurrent} 
                          aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                        >
                          {isPlaying ? <span>❚❚</span> : <span><img src="/assets/play-button.png" alt="play button" width={30} height={30} /></span>} 
                        </button>
                      </div>
                      {renderContentCard(video)}
                    </div>
                  );
                })}
              </div>

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