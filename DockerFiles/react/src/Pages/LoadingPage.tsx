import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import '../css/index.css'
import Logo from '../imgs/chargement.png'

function LoadingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule une requête asynchrone qui dure 2 secondes
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

    return (
        <div className="loading-container" style={{height:"100vh"}}>
        <img src={Logo} alt="Loading" className="loading-logo" />
        <div className="loading-text">Loading...</div>
      </div>
    )
    
  
}

export default LoadingPage;