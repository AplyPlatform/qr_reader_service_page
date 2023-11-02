window.addEventListener('DOMContentLoaded', async function () {
    if (!('mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices &&
        'Worker' in window)) {
        alert('카메라를 지원하지 않는 환경입니다. 이전 화면으로 돌아갑니다.');
        history.back();
        return;
    }

   
    let ret = await getMedia();
    if (ret == false) {
        alert('카메라를 지원하지 않는 환경이거나 카메라 사용권한을 취소하셨습니다. 이전 화면으로 돌아갑니다.\n\n다시 사용하시려면 브라우저의 새탭에서 접속해주세요.');
        history.back();
        return;
    }

    $("#wait_text").hide();
    $("#center_scan_text").show();

    if (document.referrer != "") {
        $("#back_button_area").show();
        $("#back_button_area").click(function() {
            history.back();
        });
    }

    // html elements    
    const waitScreen = document.getElementById('wait-screen');            
    const qrArea = document.getElementById('qr-reader');
    const centerScanText = document.getElementById('center_scan_text');        
    
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

function vibrate() {
    const canVibrate = window.navigator.vibrate;
    if (canVibrate) window.navigator.vibrate([10,10,5,5]);
}


async function getMedia() {
    let stream = null;
  
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      /* use the stream */
    } catch (err) {
      /* handle the error */

      return false;
    }

    stream.getTracks().forEach((track) => {
        if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
        }
    });

    return true;
}