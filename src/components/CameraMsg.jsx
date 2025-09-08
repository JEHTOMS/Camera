import React from 'react';
import './CameraMsg.css';

function CameraMsg() {
    return (
        <div className="camera-msg">
           <div className="prompt-container">
            <div className='prompt-icon'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" fill="#F1F1ED"/>
                  <mask id="mask0_191_4320" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="6" y="4" width="4" height="8">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.75 4C8.1642 4 8.5 4.33579 8.5 4.75C8.5 5.16421 8.1642 5.5 7.75 5.5C7.3358 5.5 7 5.16421 7 4.75C7 4.33579 7.3358 4 7.75 4ZM8.5 7C8.5 6.72386 8.27615 6.5 8 6.5H6.5V7.5H7.5V11H6.5V12H9.5V11H8.5V7Z" fill="#FF00FF"/>
                  </mask>
                  <g mask="url(#mask0_191_4320)">
                    <rect x="2" y="2" width="12" height="12" fill="#2A2C29"/>
                  </g>
                </svg>
            </div>
            <p className='prompt-text'>Make sure you can clearly read the name and bank details.</p>
           </div>
        </div>
    );
}

export default CameraMsg;
