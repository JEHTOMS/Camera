import React from 'react';
import './QrCode.css';

function QrCode() {
    return (
        <div>
            <div className='qr-code-container'>
                <div className='qr-code-corners'>
                    <div className='top-left-corner'></div>
                    <div className='top-right-corner'></div>
                  </div> 
                  <div className='qr-code-corners'>
                    <div className='bottom-left-corner'></div>
                    <div className='bottom-right-corner'></div>
                </div>
            </div>
        </div>
    );
}

export default QrCode;