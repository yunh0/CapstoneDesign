import React from "react";
import { Link } from 'react-router-dom';

class StartPage extends React.Component {
    render() {
        return (
            <div style={{width: '100vw', height: '100vh', position: 'relative', background: 'white'}}>
                <div style={{width: '100%', height: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -80%)', background: '#F0F0F0'}} />

                <div style={{width: '57%', height: '15%', left: '50%', top: '50%', transform: 'translate(-85%, -200%)', position: 'absolute', color: 'black', fontSize: '6vw', fontFamily: 'Ibarra Real Nova', fontWeight: '300', wordWrap: 'break-word'}}>PROJECT<br/>NAME</div>

                <Link to="/login" style={{width: '13.8%', height: '8.5%', left: '62%', top: '47%', position: 'absolute', background: '#FFFDFD', borderRadius: '2.5vw', border: '0.2vw black solid'}}>
                    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: '3.5vw', fontFamily: 'Ibarra Real Nova', fontWeight: '400', wordWrap: 'break-word'}}>Log in</div>
                </Link>
                <Link to="/signup" style={{width: '13.8%', height: '8.5%', left: '82%', top: '47%', position: 'absolute', background: '#FFFDFD', borderRadius: '2.5vw', border: '0.2vw black solid'}}>
                    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: '3.5vw', fontFamily: 'Ibarra Real Nova', fontWeight: '400', wordWrap: 'break-word'}}>Sign up</div>
                </Link>

                <div style={{width: '5.3%', height: '0.07%', left: '95%', top: 0, position: 'absolute'}} />
                <div style={{width: '100%', height: '9%', left: 0, bottom: 0, position: 'absolute', background: '#191970'}} />


            </div>
        );
    }
}

export default StartPage;
