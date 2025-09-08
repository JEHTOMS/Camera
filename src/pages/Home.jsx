import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './Home.css';
import SegmentedControl from '../components/SegmentedControl.jsx';
import Upload from '../components/Upload.jsx';
import Preview from './Preview.jsx';
import QrCode from '../components/QrCode.jsx';
import CameraMsg from '../components/CameraMsg.jsx';

function Home() {
  const [activeSegment, setActiveSegment] = useState('Photo');
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back (default to back for mobile)
  const [capturedImage, setCapturedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Default 1x zoom
  const [showPreview, setShowPreview] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [hardwareZoomSupported, setHardwareZoomSupported] = useState(true);
  
  // New state for uploaded files
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileType, setUploadedFileType] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  
  // Camera message state
  const [showCameraMsg, setShowCameraMsg] = useState(false);
  const [cameraMsgSlideOut, setCameraMsgSlideOut] = useState(false);
  const webcamRef = useRef(null);
  const containerRef = useRef(null);
  
  // Zoom levels array for cycling - adjusted for hardware zoom
  const zoomLevels = [1, 1.5, 2, 3];
  
  // Pinch to zoom state
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isPinching, setIsPinching] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current || !webcamRef.current.video) return;
    
    try {
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas to high resolution
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      
      // Calculate the zoomed region
      const scale = 1 / zoomLevel;
      const cropWidth = width * scale;
      const cropHeight = height * scale;
      const cropX = (width - cropWidth) / 2;
      const cropY = (height - cropHeight) / 2;
      
      // Set canvas size to original resolution for quality
      canvas.width = width;
      canvas.height = height;
      
      // Draw the cropped and scaled region
      ctx.drawImage(
        video,
        cropX, cropY, cropWidth, cropHeight, // Source rectangle (cropped)
        0, 0, width, height // Destination rectangle (full canvas)
      );
      
      // Convert to PNG with high quality
      const imageSrc = canvas.toDataURL('image/png', 1.0);
      
      setCapturedImage(imageSrc);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to capture image:', error);
      // Fallback to simple screenshot
      const imageSrc = webcamRef.current.getScreenshot({
        screenshotFormat: 'image/png',
        screenshotQuality: 1.0
      });
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setShowPreview(true);
      }
    }
  }, [webcamRef, zoomLevel]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setShowPreview(false);
    
    // Clean up uploaded file state
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
    setUploadedFile(null);
    setUploadedFileType(null);
    setUploadedFileUrl(null);
  }, [uploadedFileUrl]);

  const switchCamera = useCallback(() => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  }, []);

  // Zoom functionality
  const handleZoomClick = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    const nextIndex = (currentIndex + 1) % zoomLevels.length;
    setZoomLevel(zoomLevels[nextIndex]);
  }, [zoomLevel, zoomLevels]);

  // Upload modal handlers
  const openUploadModal = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    
    // Clean up previous uploaded file URL to prevent memory leaks
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
    
    // Determine file type
    const fileType = file.type;
    let category;
    
    if (fileType.startsWith('image/')) {
      category = 'image';
    } else if (fileType === 'application/pdf') {
      category = 'pdf';
    } else if (fileType.includes('document') || fileType.includes('word') || 
               fileType.includes('text') || fileType.includes('rtf')) {
      category = 'document';
    } else {
      category = 'other';
    }
    
    // Create object URL for preview
    const fileUrl = URL.createObjectURL(file);
    
    // Update state
    setUploadedFile(file);
    setUploadedFileType(category);
    setUploadedFileUrl(fileUrl);
    
    // Clear any captured image since we're now working with uploaded file
    setCapturedImage(null);
    
    // Close upload modal and show preview
    setIsUploadModalOpen(false);
    setShowPreview(true);
  }, [uploadedFileUrl]);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (uploadedFileUrl) {
        URL.revokeObjectURL(uploadedFileUrl);
      }
    };
  }, [uploadedFileUrl]);

  // Helper function to get distance between two touch points
  const getTouchDistance = (touches) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Helper function to round zoom to 1 decimal place
  const roundZoom = (zoom) => {
    return Math.round(zoom * 10) / 10;
  };

  // Pinch to zoom handlers
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsPinching(true);
      setLastTouchDistance(getTouchDistance(e.touches));
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isPinching && e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / lastTouchDistance;
      
      setZoomLevel(prevZoom => {
        const newZoom = prevZoom * scale;
        // Clamp zoom between 0.5x and 3x and round to 1 decimal
        const clampedZoom = Math.max(0.5, Math.min(3, newZoom));
        return roundZoom(clampedZoom);
      });
      
      setLastTouchDistance(currentDistance);
    }
  }, [isPinching, lastTouchDistance]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) {
      setIsPinching(false);
      setLastTouchDistance(0);
    }
  }, []);

  // Add touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const videoConstraints = {
    width: { ideal: 1920, min: 1280 },
    height: { ideal: 1080, min: 720 },
    facingMode: facingMode,
    frameRate: { ideal: 30, min: 15 },
    aspectRatio: { ideal: 16/9 }
  };

  // Try to apply hardware zoom constraints smoothly without restarting stream
  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video && hardwareZoomSupported) {
      const track = webcamRef.current.video.srcObject?.getVideoTracks()[0];
      if (track && track.applyConstraints) {
        // Apply hardware zoom constraints smoothly
        track.applyConstraints({
          zoom: zoomLevel
        }).catch(err => {
          console.warn('Hardware zoom constraint failed:', err);
          // Don't disable hardware zoom immediately, just this attempt failed
        });
      }
    }
  }, [zoomLevel, hardwareZoomSupported]);

  // Handle CameraMsg display when Photo segment is activated or on initial load
  useEffect(() => {
    if (activeSegment === 'Photo' && !showPreview && !capturedImage) {
      // Show the message immediately
      setShowCameraMsg(true);
      setCameraMsgSlideOut(false);
      
      // Start slide-down animation after 4000ms
      const slideTimer = setTimeout(() => {
        setCameraMsgSlideOut(true);
      }, 8000);
      
      // Hide completely after animation completes (additional 300ms for slide animation)
      const hideTimer = setTimeout(() => {
        setShowCameraMsg(false);
        setCameraMsgSlideOut(false);
      }, 8300);
      
      return () => {
        clearTimeout(slideTimer);
        clearTimeout(hideTimer);
      };
    } else {
      // Hide message when not in Photo mode or when preview is shown
      setShowCameraMsg(false);
      setCameraMsgSlideOut(false);
    }
  }, [activeSegment, showPreview, capturedImage]);

  // Ensure CameraMsg shows immediately on component mount if conditions are met
  useEffect(() => {
    // Small delay to ensure all initial states are set
    const initialTimer = setTimeout(() => {
      if (activeSegment === 'Photo' && !showPreview && !capturedImage) {
        setShowCameraMsg(true);
        setCameraMsgSlideOut(false);
      }
    }, 100);

    return () => clearTimeout(initialTimer);
  }, []); // Empty dependency array - runs only once on mount

  return (
    <div>
      {showPreview ? (
        <Preview 
          capturedImage={capturedImage} 
          onRetake={retakePhoto}
          uploadedFile={uploadedFile}
          uploadedFileType={uploadedFileType}
          uploadedFileUrl={uploadedFileUrl}
        />
      ) : (
        <div className="camera-container" ref={containerRef}>
        {capturedImage ? (
          <div className="captured-image-container">
            <img src={capturedImage} alt="Captured" className="captured-image" />
            <button 
              className="retake-button" 
              onClick={() => setCapturedImage(null)}
            >
              Retake
            </button>
          </div>
        ) : (
          <>
            <div 
              className="webcam-viewport"
              style={{
                transform: zoomLevel < 1 ? `scale(${zoomLevel})` : 'scale(1)',
                transition: 'transform 0.2s ease-out'
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                screenshotQuality={1.0}
                videoConstraints={videoConstraints}
                className="webcam-fullscreen"
                style={{ 
                  transform: zoomLevel >= 1 ? `scale(${zoomLevel})` : 'scale(1)',
                  transition: 'transform 0.2s ease-out'
                }}
              />
            </div>
            
            {/* QR Code overlay when QR segment is active */}
            {activeSegment === 'QR code' && (
              <div className="qr-code-overlay">
                <QrCode />
              </div>
            )}
          </>
        )}
        
        <div className="navigation-bar">
            <div className="icon-button" id="close-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <mask id="mask0_161_4875" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                    <path d="M10.2061 11.1786L4.1287 17.256L2.9502 16.0775L9.02763 10.0001L2.95022 3.92266L4.12873 2.74414L10.2061 8.82157L16.2835 2.74414L17.462 3.92266L11.3846 10.0001L17.462 16.0775L16.2835 17.256L10.2061 11.1786Z" fill="#FF00FF"/>
                </mask>
                <g mask="url(#mask0_161_4875)">
                    <rect x="0.206055" width="20" height="20" fill="white"/>
                </g>
                </svg>
             </div>
            <div className="icon-button" id="flash">
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_161_4870" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1" y="1" width="19" height="18">
                <path fillRule="evenodd" clipRule="evenodd" d="M17.619 18.591L17.9504 18.9223L19.1289 17.7438L13.4681 12.0831L16.6146 8.93659C17.1449 8.40634 16.7693 7.49974 16.0195 7.49974H12.4756L15.0894 2.92566C15.41 2.36453 15.0048 1.66641 14.3585 1.66641H9.37763C9.08197 1.66641 8.80805 1.82156 8.65597 2.07504L6.7075 5.32244L2.4622 1.07715L1.28369 2.25566L2.10698 3.07895L2.15782 3.02811L17.67 18.5401L17.619 18.591ZM4.99581 8.17526L3.66594 10.3917C3.32933 10.9527 3.73347 11.6664 4.38767 11.6664H7.4723L6.07179 17.2684C5.86473 18.0967 6.87993 18.6713 7.48347 18.0678L11.1859 14.3653L10.0074 13.1868L8.41109 14.7831L9.04963 12.229L6.82031 9.99976H5.84477L6.2106 9.39001L4.99581 8.17526ZM14.0278 9.16642L12.2896 10.9046L7.92227 6.53722L9.8448 3.33307H12.937L10.3232 7.90716C10.0025 8.46826 10.4077 9.16642 11.054 9.16642H14.0278Z" fill="#FF00FF"/>
                </mask>
                <g mask="url(#mask0_161_4870)">
                <rect x="0.206055" width="20" height="20" fill="white"/>
                </g>
                </svg>

            </div>
        </div>
        
        {/* Camera Message - shows 32px above footer when Photo segment is active */}
        {showCameraMsg && (
          <div className={`camera-msg-container ${cameraMsgSlideOut ? 'slide-out' : ''}`}>
            <CameraMsg />
          </div>
        )}
        
        <div className='footer'>
            <div className='footer-controls'>
          <button className='icon-button-lg' id='upload-button' onClick={openUploadModal}>
            <svg width="14" height="20" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.0957 0.59082C11.8569 0.591084 14.0957 2.82956 14.0957 5.59082V13.5908C14.0954 17.4564 10.9613 20.5906 7.0957 20.5908C3.22987 20.5908 0.0949904 17.4566 0.0947266 13.5908V5.59082H2.0957V13.5908C2.09597 16.352 4.33444 18.5908 7.0957 18.5908C9.85674 18.5906 12.0954 16.3519 12.0957 13.5908V5.59082C12.0957 3.93413 10.7523 2.59108 9.0957 2.59082C7.43885 2.59082 6.0957 3.93397 6.0957 5.59082V13.5908C6.09597 14.1429 6.54358 14.5908 7.0957 14.5908C7.6476 14.5906 8.09544 14.1427 8.0957 13.5908V5.59082H10.0957V13.5908C10.0954 15.2473 8.75217 16.5906 7.0957 16.5908C5.43901 16.5908 4.09597 15.2474 4.0957 13.5908V5.59082C4.0957 2.8294 6.33428 0.59082 9.0957 0.59082Z" fill="white" style={{fill: "white", fillOpacity: 1}}/>
</svg>
          </button>
          <button className='capture' id='capture-button' onClick={capture}>
            <div className='capture-icon'></div>
          </button>
          <button className="icon-button-lg" id="zoom-button" onClick={handleZoomClick}>
            {roundZoom(zoomLevel)}x
          </button>
          </div>
          <SegmentedControl
            options={[
              { value: 'Photo', label: 'Photo' },
              { value: 'QR code', label: 'QR code' },
            ]}
            value={activeSegment}
            onChange={setActiveSegment}
          />
        </div>
        <Upload 
          isOpen={isUploadModalOpen} 
          onClose={closeUploadModal} 
          onFileUpload={handleFileUpload}
        />
        </div>
      )}
    </div>
  );
}

export default Home;
