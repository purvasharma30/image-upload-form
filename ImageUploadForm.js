import React, { useState, useRef, useEffect } from 'react';

const MyForm = () => {
  const [orderId, setOrderId] = useState('');
  const [picture, setPicture] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Draw the video frame to the canvas.
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas content to data URL (base64 format)
    console.log(context.canvas.toDataURL());
  };

  const handleSuccess = (stream) => {
    // Attach the video stream to the video element and autoplay.
    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    // Request access to the user's camera when the component mounts.
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(handleSuccess)
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });

    // Cleanup the camera stream when the component unmounts.
    return () => {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>Order Form</h1>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="pictureInput">Upload Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            id="pictureInput"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Or Capture Picture:</label>
          <video ref={videoRef} autoPlay style={{ width: '100%' }} />
          <button onClick={handleCapture}>Capture</button>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="orderIdInput">Type Order ID:</label>
          <input
            type="text"
            value={orderId}
            onChange={handleOrderIdChange}
            id="orderIdInput"
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="submit">Submit</button>
        </div>
        {/* Hidden canvas element for capturing camera snapshots */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default MyForm;
