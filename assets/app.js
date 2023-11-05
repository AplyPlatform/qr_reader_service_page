let lastResult = "";

window.addEventListener('DOMContentLoaded', async function () {
    $("#wait_text").hide();
    $("#center_scan_text").show();

    if (document.referrer != "") {
        $("#back_button_area").show();
        $("#back_button_area").click(function() {
            vibrate();
            GA_EVENT("back_button", "click", "service");            
            history.back();
        });
    }
    
    lastResult = "";
    const waitScreen = document.getElementById('wait-screen');
    const qrArea = document.getElementById('qr-reader');
    const centerScanText = document.getElementById('center_scan_text');        
    function qrCodeSuccessCallback(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            lastResult = decodedText;
            waitScreen.style.display = "block";
            qrArea.style.display = "none";
            centerScanText.style.display = "none";            

            try {
                GA_EVENT("qr_read_success", decodedText, "service");
                setTimeout(() => {location.href = decodedText;}, 2000);
            }
            catch (e) {
                location.href = decodedText;
            }
        }
    }
    
    var html5QrCode = new Html5Qrcode("qr-reader");
    if (html5QrCode == null) {
        GA_EVENT("html5QrCode_error_1", "service", "service");
        alert('카메라를 지원하지 않는 환경이거나 카메라 사용권한을 취소하셨습니다. 이전 화면으로 돌아갑니다.\n\n다시 사용하시려면 브라우저의 새 탭에서 접속해 주세요.');        
        history.back();
        return;
    }
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .then((ignore) => {
        })
        .catch((err) => {
            GA_EVENT("html5QrCode_error_2", "service", "service");
            alert('카메라를 지원하지 않는 환경이거나 카메라 사용권한을 취소하셨습니다. 이전 화면으로 돌아갑니다.\n\n다시 사용하시려면 브라우저의 새 탭에서 접속해 주세요.');            
            history.back();
        });
});

function vibrate() {
    const canVibrate = window.navigator.vibrate;
    if (canVibrate) window.navigator.vibrate([10,10,5,5]);
}

function GA_EVENT(event_name, event_target_name, event_label) {
    if (typeof gtag !== 'undefined') {
      gtag(
          'event', event_name, {
            'event_category': event_target_name,
            'event_label': event_label
          }
      );
    }
}
