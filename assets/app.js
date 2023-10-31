window.addEventListener('DOMContentLoaded', function () {
    if (!('mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices &&
        'Worker' in window)) {
        alert('Sorry, your browser is not compatible with this app.');
        return;
    }

    // html elements    
    const waitScreen = document.getElementById('wait-screen');            
    const qrArea = document.getElementById('qr-reader');
    const centerScanText = document.getElementById('center_scan_text');
    
    function vibrate() {
        const canVibrate = window.navigator.vibrate;
        if (canVibrate) window.navigator.vibrate([10,10,5,5]);
    }
    
    let lastResult = "";
    function qrCodeSuccessCallback(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            lastResult = decodedText;
            waitScreen.style.display = "block";
            qrArea.style.display = "none";
            centerScanText.style.display = "none";            

            try {
                setTimeout(() => {location.href = decodedText;}, 2000);
            }
            catch (e) {

            }

            try {                                
                vibrate(); // vibration is not supported on Edge, IE, Opera and Safari
            } catch (e) {

            }
        }
    }

    var html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
});
