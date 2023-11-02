window.addEventListener('DOMContentLoaded', async function () {
    $("#wait_text").hide();
    $("#center_scan_text").show();

    if (document.referrer != "") {
        $("#back_button_area").show();
        $("#back_button_area").click(function() {
            history.back();
        });
    }
    
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
    if (html5QrCode == null) {
        alert('카메라를 지원하지 않는 환경이거나 카메라 사용권한을 취소하셨습니다. 이전 화면으로 돌아갑니다.\n\n다시 사용하시려면 브라우저의 새탭에서 접속해주세요.');
        history.back();
        return;
    }
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .then((ignore) => {
        })
        .catch((err) => {
            alert('카메라를 지원하지 않는 환경이거나 카메라 사용권한을 취소하셨습니다. 이전 화면으로 돌아갑니다.\n\n다시 사용하시려면 브라우저의 새탭에서 접속해주세요.');
            history.back();
        });    
});

function vibrate() {
    const canVibrate = window.navigator.vibrate;
    if (canVibrate) window.navigator.vibrate([10,10,5,5]);
}