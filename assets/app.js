window.addEventListener('DOMContentLoaded', function () {
    if (!('mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices &&
        'Worker' in window)) {
        alert('Sorry, your browser is not compatible with this app.');
        return;
    }

    // html elements    
    const waitScreen = document.getElementById('wait-screen');        
    const divInstall = document.getElementById('installContainer');
    const butInstall = document.getElementById('butInstall');
    const qrArea = document.getElementById('qr-reader');
    const centerScanText = document.getElementById('center_scan_text');

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Show prompt modal if user previously not set to dismissed or accepted
        divInstall.classList.toggle('hidden', false);
    });

    window.addEventListener('appinstalled', (event) => {
        console.log('👍', 'appinstalled', event);
        // Clear the deferredPrompt so it can be garbage collected
        window.deferredPrompt = null;
    });

    // Add event click function for Add button
    butInstall.addEventListener('click', async () => {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            // The deferred prompt isn't available.
            return;
        }
        // Show the install prompt.
        promptEvent.prompt();
        // Log the result
        const result = await promptEvent.userChoice;
        console.log('👍', 'userChoice', result);
        // Reset the deferred prompt variable, since
        // prompt() can only be called once.
        window.deferredPrompt = null;
        // Hide the install button.
        divInstall.classList.toggle('hidden', true);
    });

    
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
