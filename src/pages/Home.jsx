import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const images = [
    "https://images.unsplash.com/photo-1760662418182-932278aab280?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1760661696925-85cd09cac428?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1760681556856-e7e5e77a46ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600",
    "https://plus.unsplash.com/premium_photo-1760496808963-78d222781d77?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1760527806036-72829823fe9e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1760694121380-0dc12e8ac00f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[91vh] flex flex-col md:flex-row ">
      {/* LEFT IMAGE DIV - hidden on mobile */}
      <div className="hidden md:flex md:w-1/3 h-full flex-col items-center justify-center bg-gradient-to-b relative overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="portrait"
          className="w-[330px] h-[500px] object-cover rounded-2xl shadow-2xl transition-opacity duration-700"
          key={currentIndex}
        />
        <div className="flex w-[330px] mt-4">
          <h1 className="self-start text-3xl text-black font-bold">JOIN THE CULTURE.</h1>
        </div>
      </div>

      {/* CENTER CONTENT */}
     <div className="w-full md:w-1/3 h-full flex flex-col justify-center items-center p-8 
  bg-[url('https://plus.unsplash.com/premium_photo-1727967291564-aa94bd08cf46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbiUyMG1lbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600')] 
  bg-cover bg-center relative"
>
  {/* Black overlay */}
  <div className="absolute inset-0 bg-[#000] opacity-70 z-0 "></div>

  {/* Content above overlay */}
  <h1 className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-extrabold text-red-700 mb-6 text-center md:text-left">
    MENS CLUB
  </h1>

  <p className="relative z-10 text-xl sm:text-2xl text-gray-100 mb-3 uppercase tracking-wide text-center md:text-left">
    Essential for MEN
  </p>

  <p className="relative z-10 text-lg text-gray-200 italic mb-6 text-center md:text-left">
    Step up your style, be the man.
  </p>

  <button
    onClick={() => navigate("/products")}
    className="relative z-10 bg-red-700 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full hover:bg-red-800 transition-colors font-semibold tracking-wide"
  >
    Be Men
  </button>
</div>

      {/* RIGHT 3D MODEL */}
      <div className="hidden md:flex md:w-1/3 h-full items-center justify-center">
        <model-viewer
          src="/model/jacket.glb"
          alt="3D Model"
          auto-rotate
          camera-controls
          style={{ width: "600px", height: "600px" }}
        ></model-viewer>
      </div>
    </div>
  );
};

export default Home;
