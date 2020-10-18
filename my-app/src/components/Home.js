import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Map from './Map'
function Home() {
  
  return (
    <>
            <Link to="/games/israel" style={{ textDecoration: 'none', color: "balck"}}>
                <button>Israel Game</button>
            </Link>
    </>
  );
}

export default Home;