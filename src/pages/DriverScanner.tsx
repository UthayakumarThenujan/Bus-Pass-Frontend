import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const DriverScanner = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<{ status: string; message: string; studentName?: string; qrSerialNo?: string } | null>(null);
  const [scanning, setScanning] = useState(true);
  const [validating, setValidating] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessingRef = useRef(false);

  const routeId = localStorage.getItem('driverRouteId');
  const token = localStorage.getItem('driverToken');

  useEffect(() => {
    if (!token || !routeId) {
      navigate('/login');
      return;
    }

    if (scanning && !validating) {
      isProcessingRef.current = false;
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [scanning, validating]);

  const onScanSuccess = async (decodedText: string) => {
    if (isProcessingRef.current) return; 
    isProcessingRef.current = true;

    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    
    setScanning(false);
    setValidating(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/validation`, {
        encryptedQrData: decodedText,
        routeId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setScanResult(response.data);
    } catch (error: any) {
      setScanResult({
        status: 'ERROR',
        message: error.response?.data?.message || 'Failed to validate ticket'
      });
    } finally {
      setValidating(false);
    }
  };

  const onScanFailure = (_error: any) => {
    // Ignore scan failures
  };

  const handleScanNext = () => {
    setScanResult(null);
    setScanning(true);
  };

  const getStatusColor = (status: string) => {
    if (status === 'VALID') return 'bg-green-500 text-white';
    if (status === 'ERROR') return 'bg-red-500 text-white';
    return 'bg-red-500 text-white'; 
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <main className="flex-1 flex flex-col p-4 overflow-y-auto pb-24">
        {scanning ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 flex-1 flex flex-col justify-center overflow-hidden">
              <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-primary/20"></div>
              <p className="text-center text-gray-500 mt-6 text-sm font-medium">Point camera at student QR code</p>
            </div>
          </div>
        ) : validating ? (
          <div className="flex-1 flex flex-col justify-center items-center p-6 rounded-3xl shadow-lg bg-white border border-gray-100 animate-pulse">
             <Loader2 size={64} className="animate-spin text-primary mb-4" />
             <h2 className="text-xl font-bold text-gray-700">Validating Pass...</h2>
          </div>
        ) : (
          <div className={`flex-1 flex flex-col justify-center p-6 rounded-3xl shadow-lg transition-all transform animate-fade-in ${getStatusColor(scanResult?.status)}`}>
            <div className="text-center">
              {scanResult?.status === 'VALID' ? (
                <CheckCircle size={80} className="mx-auto mb-6 opacity-90 animate-bounce" />
              ) : (
                <XCircle size={80} className="mx-auto mb-6 opacity-90 animate-pulse" />
              )}
              
              <h2 className="text-3xl font-black mb-2 uppercase tracking-wide">
                {scanResult?.status === 'VALID' ? 'VALID PASS' : 'REJECTED'}
              </h2>
              
              <p className="text-lg font-medium opacity-90 mb-8">
                {scanResult?.message}
              </p>

              {scanResult?.status === 'VALID' && (
                <div className="bg-black/10 rounded-2xl p-6 backdrop-blur-sm text-left mb-8">
                  <p className="text-sm opacity-80 uppercase tracking-wider font-bold mb-1">Student Name</p>
                  <p className="text-xl font-bold mb-4">{scanResult.studentName}</p>
                  <p className="text-sm opacity-80 uppercase tracking-wider font-bold mb-1">Ticket ID</p>
                  <p className="font-mono text-sm">{scanResult.qrSerialNo}</p>
                </div>
              )}

              <button 
                onClick={handleScanNext}
                className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                SCAN NEXT STUDENT
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverScanner;
