import { useState, useEffect } from "react";
import '../css/index.css'
import Logo from '../imgs/chargement.png'
import { TopBar } from "./NavBar";
import { useNavigate } from "react-router-dom";
function LoadingPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Simule une requête asynchrone qui dure 2 secondes
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

    return (
        <div>
          <TopBar/>
        <div className="loading-container" style={{height:"100vh"}}>
        <img src={Logo} alt="Loading" className="loading-logo" />
        <div className="loading-text">Loading...</div>
      </div>
        </div>
    )
    
  
}

export default LoadingPage;