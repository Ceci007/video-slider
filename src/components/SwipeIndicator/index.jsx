import React from 'react';

// Define la animación de rotación usando un objeto de estilo
const rotationStyle = `
    @keyframes rotate-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Contenedor del Indicador */
    .swipe-indicator-container {
        position: relative;
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px auto; /* Para centrar en la demo */
    }

    /* Estilos del SVG */
    .swipe-svg {
        position: absolute;
        width: 100%;
        height: 100%;
        fill: none;
        animation: rotate-slow 15s linear infinite; /* Aplicar la animación */
    }

    .swipe-text {
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        fill: #ffffff; 
        font-weight: 600;
    }
    
    /* Estilos de la Flecha Central */
    .central-arrow {
        width: 50px; 
        height: 50px;
        background-image: linear-gradient(to right bottom, #f8e166, #efb30d);
        color: #0C111F;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        transition: transform 0.2s;
        cursor: pointer;
    }

    .central-arrow:hover {
        transform: scale(1.1);
    }
    
    /* Estilos de la demo */
    .dark-background-demo {
        background-color: #0C111F;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        padding: 10px;
    }
`;

const SwipeIndicator = () => {

    const handleClick = () => {
        console.log('Swipe/Scroll action triggered!');
        // Aquí se agregaría la lógica real de desplazamiento
    };

    return (
        <div className="dark-background-demo">
            <style>{rotationStyle}</style>
            <div className="swipe-indicator-container" onClick={handleClick} role="button" aria-label="Scroll Down">
                
                {/* Circular Text SVG */}
                <svg className="swipe-svg" viewBox="0 0 100 100">
                    <defs>
                        {/* Define el path circular */}
                        <path id="circlePathReact"
                            d="M 50, 50 m -45, 0 a 45, 45 0 1, 1 90, 0 a 45, 45 0 1, 1 -90, 0" />
                    </defs>
                    {/* Texto enlazado al path */}
                    <text className="swipe-text" dy="3">
                        <textPath href="#circlePathReact" startOffset="50%">
                            • Lihat Lainya - Lihat Lainya  
                        </textPath>
                    </text>
                </svg>
                
                {/* Flecha Abajo Central */}
                <div className="central-arrow">
                   <img src="/assets/arrow-down-icon.png" alt="arrow down icon" />
                </div>

            </div>
        </div>
    );
};

export default SwipeIndicator;