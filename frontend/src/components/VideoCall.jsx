import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaVideo, 
  FaVideoSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhoneSlash, 
  FaPhone, 
  FaExpand, 
  FaCompress,
  FaUserMd,
  FaUser
} from 'react-icons/fa';

const VideoCall = ({ appointment, onClose }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting'); // 'connecting', 'active', 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callTimerRef = useRef(null);

  useEffect(() => {
    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus('active');
      
      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }, 3000);

    // Simulate getting user media
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
        });
    }

    return () => {
      clearTimeout(connectTimer);
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In a real app, this would mute/unmute the video track
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // In a real app, this would mute/unmute the audio track
  };

  const endCall = () => {
    setCallStatus('ended');
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    // In a real app, this would close the connection
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real app, this would toggle fullscreen mode
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 ${isFullscreen ? 'z-50' : ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gray-900 rounded-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col ${isFullscreen ? 'max-w-none max-h-none rounded-none' : ''}`}
      >
        {/* Call Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Teleconsultation Call
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <div className={`w-2 h-2 rounded-full ${callStatus === 'active' ? 'bg-green-500' : callStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {callStatus === 'connecting' ? 'Connecting...' : 
                   callStatus === 'active' ? `Active (${formatTime(callDuration)})` : 
                   'Call ended'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaExpand className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Call Content */}
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
          {/* Remote Video */}
          <div className="flex-1 relative bg-black rounded-xl overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <FaUserMd className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">
                    {appointment?.doctor?.name || 'Dr. Smith'}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {appointment?.doctor?.specialization || 'General Physician'}
                  </div>
                </div>
              </div>
            </div>
            
            {callStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <div className="text-white font-medium">Connecting to doctor...</div>
                </div>
              </div>
            )}
            
            {callStatus === 'ended' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPhone className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-medium text-xl">Call Ended</div>
                  <div className="text-gray-300 mt-2">Thank you for using MedBook Teleconsultation</div>
                </div>
              </div>
            )}
          </div>

          {/* Local Video */}
          <div className="md:w-1/3 relative bg-gray-800 rounded-xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-full">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <div className="text-white font-medium text-sm">
                  You
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500'} transition-colors`}
            >
              {isAudioOn ? (
                <FaMicrophone className="w-6 h-6 text-white" />
              ) : (
                <FaMicrophoneSlash className="w-6 h-6 text-white" />
              )}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500'} transition-colors`}
            >
              {isVideoOn ? (
                <FaVideo className="w-6 h-6 text-white" />
              ) : (
                <FaVideoSlash className="w-6 h-6 text-white" />
              )}
            </button>
            
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <FaPhoneSlash className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              {isFullscreen ? (
                <FaCompress className="w-6 h-6 text-white" />
              ) : (
                <FaExpand className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center text-gray-400 text-sm">
            {callStatus === 'active' ? (
              <div>Press the red button to end the call</div>
            ) : callStatus === 'connecting' ? (
              <div>Establishing secure connection...</div>
            ) : (
              <div>Call has ended. Closing window...</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoCall;