import React from 'react';
import Webcam from 'react-webcam';
import './Home.css';
import SegmentedControl from '../components/SegmentedControl.jsx';
import Upload from '../components/Upload.jsx';
import './Preview.css';

function Preview({ capturedImage, onRetake }) {
    return (
        <div>
       <div className="camera-container">
        <div className="navigation-bar-preview">
            <div className="icon-button" id="back-button" onClick={onRetake}>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_161_3238" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="1" y="3" width="18" height="15">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.51189 9.66673L9.75596 4.42266L8.57746 3.24414L1.91668 9.9049C1.58799 10.2336 1.58799 10.7665 1.91668 11.0952L8.57746 17.756L9.75596 16.5775L4.51189 11.3334H18.3334V9.66673H4.51189Z" fill="#FF00FF"/>
                    </mask>
                    <g mask="url(#mask0_161_3238)">
                        <rect y="0.5" width="20" height="20" fill="white"/>
                    </g>
                </svg>
             </div>
        </div>
        <div className="preview-content">
          {capturedImage && (
            <img src={capturedImage} alt="Captured preview" className="preview-image" />
          )}
        </div>
         <div className='footer-preview'>
            <div className='footer-controls'>
          <button className='retake' id='retake' onClick={onRetake}>
            Retake
          </button>
          <button className="continue" id="continue">
            Continue
          </button>
          </div>
          </div>
       </div>
       </div>
    );
}

export default Preview;
