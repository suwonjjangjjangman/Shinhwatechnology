const boardsns = function () {

    var shareTwitter = function (sendTextId) {
        var sendText = $("#" + sendTextId).text();

        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl, 'popup', 'width=500,height=600');
    }

    var shareFacebook = function () {
        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendUrl, 'popup', 'width=500,height=600');
    }

    var shareNaver = function (sendTextId) {
        var sendText = $("#" + sendTextId).text();

        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        window.open('https://share.naver.com/web/shareView.nhn?url=' + sendUrl + '&title=' + sendText, 'naversharedialog', 'height=600,width=600');
    }

    var shareLine = function () {
        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        window.open("http://line.me/R/msg/text/?" + sendUrl, 'popup', 'width=500,height=600');
    }

    var shareNaverBand = function (sendTextId) {
        var sendText = $("#" + sendTextId).text();

        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        window.open("http://band.us/plugin/share?body=" + sendText + "&route=" + sendUrl, 'popup', 'width=500,height=600');
    }

    var shareKakaoStory = function (sendTextId) {
        var sendText = $("#" + sendTextId).text();

        // SDK를 초기화 합니다. 사용할 앱의 JavaScript 키를 설정해 주세요.
        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        Kakao.Story.share({
            url: sendUrl,
            text: sendText
        });
    }

    var shareKakao = function (sendTextId, sendText2Id, thumbnail_url) {

        // SDK를 초기화 합니다. 사용할 앱의 JavaScript 키를 설정해 주세요.
        // SDK 초기화 여부를 판단합니다.
        var sendText = $("#" + sendTextId).text();
        var sendText2 = $("#" + sendText2Id).text();

        String.prototype.cut = function (len) {
            var str = this;
            var s = 0;
            for (var i = 0; i < str.length; i++) {
                s += (str.charCodeAt(i) > 128) ? 2 : 1;
                if (s > len) return str.substring(0, i) + "...";
            }
            return str;
        }

        sendText2 = sendText2.cut(45);
        var sendUrl = window.location.protocol + "//" + location.hostname + location.pathname; // 전달할 URL
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: sendText,
                description: sendText2,
                imageUrl: thumbnail_url,
                link: {
                    mobileWebUrl: sendUrl,
                    webUrl: sendUrl
                },
            },
            installTalk: true,
        })
    }

    var shareLink = function () {
        var obShareUrl = document.getElementById("ShareUrl");
        obShareUrl.value = window.document.location.href; // 현재 URL 을 세팅해 줍니다.
        obShareUrl.select(); // 해당 값이 선택되도록 select() 합니다
        document.execCommand("copy"); // 클립보드에 복사합니다.
        obShareUrl.blur(); // 선택된 것을 다시 선택안된것으로 바꿈니다.
        alert(getLangMsg('copy-url-success'));
    }

    return {
        'share_link': shareLink,
        'share_twitter': shareTwitter,
        'share_facebook': shareFacebook,
        'share_naver': shareNaver,
        'share_line': shareLine,
        'share_kakao_story': shareKakaoStory,
        'share_naver_band': shareNaverBand,
        'share_kakao': shareKakao,
    }
};