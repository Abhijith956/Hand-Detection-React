import { useEffect, useRef, useState } from "react";
import { createHandDetector } from "../handDetector";
import { sendDetection } from "../services/detectionService";
import { logout } from "../services/authService";

function Camera({ onLogout }) {
    const videoRef = useRef(null);
    const detectorRef = useRef(null);
    const animationRef = useRef(null);
    const candidateHandRef = useRef(null);
    const candidateCountRef = useRef(0);
    const stableHandRef = useRef(null);
    const REQUIRED_STABLE_FRAMES = 5;

    const [hand, setHand] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [handChangeMessage, setHandChangeMessage] = useState("");
    const [isCameraOn, setIsCameraOn] = useState(true);
    const CONFIDENCE_THRESHOLD = 0.8;

    const handleLogout = async () => {
        setIsCameraOn(false); // turn off camera stream immediately
        await logout(); // Calls backend to blacklist token and clears local state via triggerLogout
    };

    useEffect(() => {
        let isMounted = true;
        let stream;

        if (!isCameraOn) {
            setLoading(false);
            setHand(null);
            setConfidence(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            return;
        }

        const processHandDetection = (detectedHandName, detectedConfidence) => {
            // Ignore weak detections
            if (detectedConfidence < CONFIDENCE_THRESHOLD) {
                candidateHandRef.current = null;
                candidateCountRef.current = 0;
                return;
            }

            // First detection
            if (candidateHandRef.current === null) {
                candidateHandRef.current = detectedHandName;
                candidateCountRef.current = 1;
                return;
            }

            // Same hand detected again
            if (candidateHandRef.current === detectedHandName) {
                candidateCountRef.current += 1;
            } else {
                // Different hand detected -> start counting again
                candidateHandRef.current = detectedHandName;
                candidateCountRef.current = 1;
            }

            // Accept only after 5 consecutive frames
            if (candidateCountRef.current >= REQUIRED_STABLE_FRAMES) {
                // Only send if this is actually a change
                if (stableHandRef.current !== detectedHandName) {
                    const prev = stableHandRef.current || "None";
                    const message = `Hand changed: ${prev} → ${detectedHandName}`;
                    
                    setHandChangeMessage(message);
                    console.log(message);

                    stableHandRef.current = detectedHandName;

                    sendDetection(detectedHandName, detectedConfidence)
                        .then(response => console.log("Detection API success:", response))
                        .catch(error => console.error("Detection API error:", error));
                }
            }
        };

        const detectHands = () => {
            if (!isMounted || !videoRef.current || !detectorRef.current) {
                return;
            }

            const video = videoRef.current;

            if (video.readyState >= 2) {
                const results =
                    detectorRef.current.detectForVideo(
                        video,
                        performance.now()
                    );

                if (
                    results.handednesses &&
                    results.handednesses.length > 0
                ) {
                    const detectedHand =
                        results.handednesses[0][0];

                    const detectedConfidence = detectedHand.score;
                    const currentHand = detectedHand.categoryName;

                    setHand(currentHand);
                    setConfidence(detectedConfidence);
                    
                    processHandDetection(currentHand, detectedConfidence);
                } else {
                    setHand(null);
                    setConfidence(null);
                    candidateHandRef.current = null;
                    candidateCountRef.current = 0;
                }
            }

            if (isMounted) {
                animationRef.current = requestAnimationFrame(detectHands);
            }
        };

        const start = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    },
                    audio: false,
                });

                if (!isMounted) {
                    // If the camera was turned off while we were waiting for permissions
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                stream = mediaStream;
                videoRef.current.srcObject = stream;

                detectorRef.current = await createHandDetector();

                if (!isMounted) return;

                setLoading(false);

                await videoRef.current.play();

                if (isMounted) {
                    detectHands();
                }
            } catch (error) {
                console.error(
                    "Camera or MediaPipe error:",
                    error
                );
                
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        start();

        return () => {
            isMounted = false;

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            detectorRef.current?.close();
        };
    }, [isCameraOn]);

    return (
        <div className="w-full h-full flex flex-col gap-3 md:gap-6 max-w-7xl mx-auto p-4 md:p-6">
            
            {/* Top Bar (Info Cards & Logout) */}
            <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-3 md:gap-4 shrink-0">
                <div className="bg-white/80 backdrop-blur-md border border-amber-900/10 rounded-xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm flex-1 flex items-center justify-center text-center font-semibold text-amber-950">
                    <span className="opacity-70 mr-2 text-sm font-normal">Confidence:</span> 
                    {confidence ? (confidence * 100).toFixed(1) : "0.0"}%
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-amber-900/10 rounded-xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm flex-1 flex items-center justify-center text-center font-semibold text-amber-950">
                    <span className="opacity-70 mr-2 text-sm font-normal">Status:</span> 
                    {loading ? "Initializing..." : "Active"}
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-amber-900/10 rounded-xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm flex-1 flex items-center justify-center text-center font-semibold text-amber-950">
                    <span className="opacity-70 mr-2 text-sm font-normal">Mode:</span> 
                    Hand Tracking
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm font-semibold transition-all hover:shadow-md active:scale-95 flex items-center justify-center mt-2 md:mt-0"
                    title="Logout"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                </button>
            </div>

            {/* Video Container */}
            <div className="relative flex-1 w-full bg-black rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden flex items-center justify-center">
                {!isCameraOn ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f5efe6] text-amber-900">
                        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        <p className="font-bold tracking-wide text-xl opacity-70">Camera is turned off</p>
                    </div>
                ) : loading ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f5efe6]/80 backdrop-blur-md">
                        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-amber-900 font-bold tracking-wide">Loading Camera Model...</p>
                    </div>
                ) : null}
                
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                />

                {/* Top-Left Overlay Text inside Video */}
                {hand && isCameraOn && (
                    <div className="absolute top-6 left-8 z-20 pointer-events-none drop-shadow-xl">
                        <h2 className="text-6xl md:text-[50px] font-semibold text-black tracking-normal leading-none" style={{ fontFamily: '"Carlito", sans-serif', WebkitTextStroke: '1px white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {hand}: ok
                        </h2>
                    </div>
                )}
            </div>

            {/* Bottom Bar (Controls) */}
            <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-3 md:gap-4 shrink-0">
                <div className="bg-white/80 backdrop-blur-md border border-amber-900/10 rounded-xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm flex-1 flex items-center justify-center text-sm font-semibold text-amber-950 truncate">
                    <span className="opacity-70 mr-2 font-normal">Activity:</span> 
                    {!isCameraOn ? "Camera offline" : (handChangeMessage || "No gestures detected")}
                </div>
                <button 
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className={`${isCameraOn ? 'bg-amber-900 hover:bg-amber-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white border border-amber-900/20 rounded-xl px-6 md:px-8 py-2.5 md:py-3 shadow-md flex-1 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                >
                    {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                </button>
            </div>
        </div>
    );
}

export default Camera;