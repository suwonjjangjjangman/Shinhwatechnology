$(document).ready(function () {
    const pageURL = window.location.href;
    const editPageFind =  /\/[^\/]+\/edit\/[^\/]+/;
    const writePageFind = /\/[^\/]+\/write\/[^\/]+/;

    if ($.cookie('copy_allow') === 'T' && (!editPageFind.test(pageURL) && !writePageFind.test(pageURL))) {
        $(document).bind('contextmenu', function (e) {
            alert(getLangMsg('right_click'));
            return false;
        });
        $(document).bind('selectstart', function (e) {
            if ((e.target.closest('.note-editor') == null)) {
                return false;
            }
        });
        $(document).bind('dragstart', function (e) {
            if ((e.target.closest('.note-editor') == null)) {
                return false;
            }
        });
    }


    //에디터 쿠키 삭제
    $.removeCookie('edit_mode', { path: '/' });

    $('[data-toggle="tooltip"]').tooltip()

    //썸머노트 부트
    var locale = getLocale().toString().replace('/', '');
    var lang = 'ko-KR';
    if (locale == 'en') {
        lang = 'en-US';
    } else if (locale == 'kr') {
        lang = 'ko-KR';
    }
    var form_id = $('.b-editor-new').closest("form").attr('id');

});
function submitContents() {
    $("#contents").html(get_ckeditor_content()); 
}

//썸머노트 파일 삭제
function deleteFileSummerNote(src) {
    $.ajax({
        type: "post",
        data: {
            "src": src
        },
        url: "/summernote/delete",
        cache: false,
        success: function (result) { }
    });
}

//썸머노트 이미지 등록
function sendFileSummerNote(el, form_id, file, editor, welEditable) {
    var form = document.getElementById(form_id);
    data = new FormData(form);
    data.append("file", file);
    $.ajax({
        type: "post",
        url: "/summernote/upload", // image 저장 소스
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'Json',
        success: function (result) {
            if (result.code == 1) {
                var image = $('<img>').attr('src', '' + result.data); // 에디터에 img 태그로 저장을 하기 위함
                el.summernote("insertNode", image[0]); // summernote 에디터에 img 태그를 보여줌
                //editor.insertImage(welEditable, data);
            } else {
                alert(result.data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus + " " + errorThrown);
        }
    });
}

$(document).on('click', '.menu-link', function () {
    var menuNo = $(this).data('menuNo');
    $.cookie('menu_no', menuNo, { path: '/' });
});

$(document).on("click", ".thumb-delete", function () {
    $("#thumb").val('');
    var del = $(this).closest(".preview-thumb-box");
    var i = '<i class="far fa-image"></i>';
    $('.thumb_btn').append(i);
    del.remove();
    $('.thumb_btn').removeClass('on');
    return false;
});

$(document).on("click" , "[data-img-origin='true'] img", function(e){
    e.preventDefault();

    let image = $(this)[0];
    let imageSrc = $(this).attr("src");
    imageNaturalWidth = image.naturalWidth;
    imageNaturalHeight = image.naturalHeight;

    var $pswp = $('.pswp')[0]
    var options = {
        index: 0,
        bgOpacity: 0.85,
        showHideOpacity: true,
        closeOnScroll: false,
    };

    var item = [{
        src: imageSrc,
        w: imageNaturalWidth,
        h: imageNaturalHeight,
    }];
    var gallery = new PhotoSwipe($pswp, PhotoSwipeUI_Default, item, options);
    gallery.init();

    gallery.listen('close', function () {
        $('.pswp').removeClass('pswp--open');
    });      

});

$(document).on("click" , "[data-img-origin='true'] .img-wrapper", function(e){
    e.preventDefault();

    let image = $(this).find("img")[0];
    let imageSrc = $(image).attr("src");
    imageNaturalWidth = image.naturalWidth;
    imageNaturalHeight = image.naturalHeight;

    var $pswp = $('.pswp')[0]
    var options = {
        index: 0,
        bgOpacity: 0.85,
        showHideOpacity: true,
        closeOnScroll: false,
    };

    var item = [{
        src: imageSrc,
        w: imageNaturalWidth,
        h: imageNaturalHeight,
    }];
    var gallery = new PhotoSwipe($pswp, PhotoSwipeUI_Default, item, options);
    gallery.init();

    gallery.listen('close', function () {
        setTimeout(function () {
            $('.pswp').removeClass().addClass("pswp");
          }, 500); // 애니메이션 완료 후 제거
    });      
});


//TODO:  블럭별로 기능 분리
$(document).on('keydown', 'input', function () {
    var $btn = $(this).closest('.search-wrapper').find('button');

    var board_search = $btn.hasClass('board-search-btn');
    var gallery_search = $btn.hasClass('gallery-search-btn');
    var shop_search = $btn.hasClass('shop-search-btn');
    var mapboard_search_btn = $btn.hasClass('mapboard-search-btn');
    var site_search_btn = $btn.hasClass('site-search-btn');
    //    var search = $(this).closest('.search-wrapper').length;
    var path = window.location.pathname;
    if (path !== getLocale() + '/login') {
        if (event.keyCode === 13) {
            event.preventDefault();
        }

    }
    if (event.keyCode === 13) {
        if (gallery_search) {
            if (typeof gallery_obj === "object") {
                gallery_obj.search_gallery($btn);
            }
        }
        if (shop_search) {
            if (typeof shop_board_obj === "object") {
                shop_board_obj.search_shop($btn);
            }
        }
        if (board_search) {
            if (typeof board_obj === "object") {
                board_obj.search_board($btn);
            }
        }
        if (mapboard_search_btn) {
            $btn.click();
        }
        if (site_search_btn) {
            $btn.click();
        }
    }
});
$(document).ready(function () {

    $(".basic-slide").each(function () {
        var section_id = $(this).attr('id');
        var delay = $(this).data('delay');
        var layout = $(this).data('layout');
        var height = $(this).data('height');
        var paging = $(this).data('paging');
        var effect = $(this).data('effect');
        var move = $(this).data('move');
        var option = new Object();

        var tmp_side_content = $('#' + section_id).find(".tmp_slide_content .block-width")
        if(tmp_side_content[0] != undefined){
            var tmp_slide_height = $(this).find(".section-inner").height()
            var tmp_slide_width = $(this).find(".section-inner").width()
            var tmp_slide_padding_top = $(this).find(".section-inner").css('padding-top').replace("px" , "")
            var tmp_slide_padding_bottom = $(this).find(".section-inner").css('padding-bottom').replace("px" , "")
            var tmp_slide_padding_left = $(this).find(".section-inner .h-con").css('padding-left').replace("px" , "")
            var tmp_slide_padding_right = $(this).find(".section-inner .h-con").css('padding-right').replace("px" , "")

            $(this).find(".section-inner").empty().css({"height" : ((tmp_slide_height * 1) + (tmp_slide_padding_top * 1) + (tmp_slide_padding_bottom*1))+"px" , "width" : tmp_slide_width+'px'})
            $('#' + section_id).find(".tmp_slide_content .section-inner").attr("data-bg-item" , "")
            $('#' + section_id).find(".tmp_slide_content .section-inner").append(tmp_side_content)
            $('#' + section_id).find(".tmp_slide_content").css({
                                                                "top" : ((tmp_slide_padding_top * 1) + 28) + "px" ,
                                                                "bottom" : (tmp_slide_padding_bottom*1) + "px" , 
                                                                "padding-left" : tmp_slide_padding_left + "px",
                                                                "padding-right" : tmp_slide_padding_right + "px"
                                                                })
            $('#' + section_id).find(".tmp_slide_content").empty().append(tmp_side_content).show();
        }
        if (move === 'T') {
            option.navigation = {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            };
        }

        if (paging === 'T') {
            option.pagination = {
                el: '.swiper-pagination'
            };
        }

        delay = Number(delay) * 1000;
        option.effect = effect;
        if (effect == 'fade') {
            option.fadeEffect = {
                crossFade: true
            };
        }
        option.speed = 1000;
        option.autoplay = {
            delay: delay,
            disableOnInteraction: false
        };
        if (height === 'A') {
            option.autoHeight = true;
        }
        option.loop = true;
        option.on = {
            slideChangeTransitionEnd: function () {
                AOS.refresh();
            },
        };
        var swiper = new Swiper('#' + section_id + ' .swiper-container', option);
    });

    $(".pn-slide").each(function () {
        var section_id = $(this).attr('id');
        var delay = $(this).data('delay');
        var layout = $(this).data('layout');
        var height = $(this).data('height');
        var paging = $(this).data('paging');
        var effect = $(this).data('effect');
        var move = $(this).data('move');
        var option = new Object();
        if (move === 'T') {
            option.navigation = {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            };
        }

        if (paging === 'T') {
            option.pagination = {
                el: '.swiper-pagination'
            };
        }

        delay = Number(delay) * 1000;
        option.speed = 1000;

        option.effect = effect;
        option.slidesPerView = 3;
        option.spaceBetween = 0;

        option.autoplay = {
            delay: delay,
            disableOnInteraction: false
        };
        if (height === 'A') {
            option.autoHeight = true;
        }
        option.loop = true;
        option.on = {
            slideChangeTransitionEnd: function () {
                AOS.refresh();
            },
        };
        var swiper = new Swiper('#' + section_id + ' .swiper-container', option);
    });
    $(".thumbnail-slide").each(function () {
        var section_id = $(this).attr('id');
        var delay = $(this).data('delay');
        var layout = $(this).data('layout');
        var height = $(this).data('height');
        var paging = $(this).data('paging');
        var effect = $(this).data('effect');
        var move = $(this).data('move');
        var slideCnt = $(this).data('slideCnt');
        var option = new Object();
        option.loop = true;
        option.spaceBetween = 10;
        option.watchSlidesProgress = 10;
        option.slidesPerView = slideCnt;
        option.freeMode = true;
        option.watchSlidesProgress = true;
        option.on = {
            slideChangeTransitionEnd: function () {
                AOS.refresh();
            },
        };
        var swiper = new Swiper('#' + section_id + ' .thumb-wrap', option);

        var option = new Object();
        option.loop = true;
        if (move === 'T') {
            option.navigation = {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            };
        }

        if (paging === 'T') {
            option.pagination = {
                el: '.swiper-pagination'
            };
        }

        delay = Number(delay) * 1000;
        option.speed = 1000;
        option.autoplay = {
            delay: delay,
            disableOnInteraction: false
        };
        if (height === 'A') {
            option.autoHeight = true;
        }

        option.spaceBetween = 10;
        option.thumbs = {
            'swiper': swiper
        };
        option.effect = effect;
        if (effect == 'fade') {
            option.fadeEffect = {
                crossFade: true
            };
        }
        option.on = {
            slideChangeTransitionEnd: function () {
                AOS.refresh();
            },
        };
        var swiper2 = new Swiper('#' + section_id + ' .swiper-container', option);
    });
    $(".dday").each(function () {
        var section_id = $(this).attr('id').toString();
        var section_no = section_id.replace("section_", "");
        var ddayDate = $(this).find(".section-inner").data('ddayDate');
        $(this).find(".countdown-wrapper").countdown(ddayDate, function (event) {
            $(this).html(event.strftime(
                '<div class="time-wrap"><div class="time-box"><div class="time ">%D</div><div class="text">Days</div></div></div>' +
                '<div class="time-wrap"><div class="time-box"><div class="time ">%H</div><div class="text">Hour</div></div></div>' +
                '<div class="time-wrap"><div class="time-box"><div class="time ">%M</div><div class="text">Minute</div></div></div>' +
                '<div class="time-wrap"><div class="time-box"><div class="time ">%S</div><div class="text">Second</div></div></div>'
            ));
        }).on('finish.countdown', function () {
            $.ajax({
                type: "get",
                url: getLocale() + "/countdown",
                data: "section_no=" + section_no,
                dataType: 'Json',
                success: function (result) {
                    if (result.code) {
                        if (result.data[0].url_allow === 'T') {
                            window.open(result.data[0].url);
                        }
                    } else {
                        alert(result.message);
                    }
                }
            });
        });
        var now = new Date();
        var dday = new Date(ddayDate);
        if (now.getTime() > dday.getTime()) {
            $.ajax({
                type: "get",
                url: getLocale() + "/countdown",
                data: "section_no=" + section_no,
                dataType: 'Json',
                success: function (result) {
                    if (result.code) {
                        if (result.data[0].url_allow === 'T') {
                            window.open(result.data[0].url);
                        }
                    } else {
                        alert(result.message);
                    }
                }
            });
        }
    });

    $.each($(".tui-datepicker-input"), function () {
        var tag_id = $(this).find("input").attr("id");
        var date = $(this).find("input").val;
        //DatePicker(tag_id, date);
    });
    if ($('.multi-file').length > 0) {
        $('.multi-file').MultiFile({
            max: CONF_UPLOAD['total_max_count'], //업로드 최대 파일 갯수 (지정하지 않으면 무한대)
            accept: 'jpg,jpeg,png,gif,bmp,tiff,webp,mp4,mov,avi,wmv,flv,mkv,webm,mp3,wav,ogg,flac,aac,zip,rar,7z,pdf,doc,docx,ppt,pptx,xls,xlsx,txt,odt,ods,odp,rtf,hwp', //허용할 확장자(지정하지 않으면 모든 확장자 허용)
            maxfile: CONF_UPLOAD['max_size'], //각 파일 최대 업로드 크기
            maxsize: CONF_UPLOAD['total_max_size'], //전체 파일 최대 업로드 크기
            STRING: { //Multi-lingual support : 메시지 수정 가능
                remove: getLangMsg('multi-file_remove'), //추가한 파일 제거 문구, 이미태그를 사용하면 이미지사용가능
                duplicate: getLangMsg('multi-file_duplicate'),
                denied: getLangMsg('multi-file_denied'),
                selected: getLangMsg('multi-file_selected'),
                toomuch: getLangMsg('multi-file_toomuch'),
                toomany: getLangMsg('multi-file_toomany'),
                toobig: getLangMsg('multi-file_toobig')
            },
        });
        $(".del-file-btn").click(function () {
            if ($(this).next("input[type='checkbox']").is(":checked")) {
                $(this).next("input[type='checkbox']").prop("checked", false);
            } else {
                $(this).closest("p").hide();
                $(this).next("input[type='checkbox']").prop("checked", true);
            }
        });

        $(".del-thumb-btn").click(function () {
            if ($(this).next("input[type='checkbox']").is(":checked")) {
                $(this).next("input[type='checkbox']").prop("checked", false);
            } else {
                $(this).closest("p").hide();
                $(this).next("input[type='checkbox']").prop("checked", true);
            }
        });
    }
    if ($('.multi-gallery-file').length > 0) {
        $('.multi-gallery-file').MultiFile({
            max: CONF_UPLOAD['total_max_count'], //업로드 최대 파일 갯수 (지정하지 않으면 무한대)
            //        accept: 'jpg|png|gif', //허용할 확장자(지정하지 않으면 모든 확장자 허용)
            maxfile: CONF_UPLOAD['max_size'], //각 파일 최대 업로드 크기
            maxsize: CONF_UPLOAD['total_max_size'], //전체 파일 최대 업로드 크기
            STRING: { //Multi-lingual support : 메시지 수정 가능
                remove: getLangMsg('multi-file_remove'), //추가한 파일 제거 문구, 이미태그를 사용하면 이미지사용가능
                duplicate: getLangMsg('multi-file_duplicate'),
                denied: getLangMsg('multi-file_denied'),
                selected: getLangMsg('multi-file_selected'),
                toomuch: getLangMsg('multi-file_toomuch'),
                toomany: getLangMsg('multi-file_toomany'),
                toobig: getLangMsg('multi-file_toobig')
            },
            list: ".ui-sortable"
        });
        $(".del-gallery-file-btn").click(function () {
            if ($(this).next("input[type='checkbox']").is(":checked")) {
                $(this).next("input[type='checkbox']").prop("checked", false);
            } else {
                $(this).closest("li").hide();
                $(this).prev().find("input[type='checkbox']").prop("checked", true);
                $(this).prev().find("input[name='priority[]']").attr("disabled", true);
            }
        });
    }

    $(".post-btn").click(function () {
        var tag_id = $(this).attr("id");
        $zip_code = $("#" + tag_id + "_addr_1");
        $addr1 = $("#" + tag_id + "_addr_2");
        $addr2 = $("#" + tag_id + "_addr_3");
        new daum.Postcode({
            oncomplete: function (data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if (data.userSelectedType === 'R') {
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if (extraAddr !== '') {
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    //                    document.getElementById("sample6_extraAddress").value = extraAddr;

                } else {
                    //                    document.getElementById("sample6_extraAddress").value = '';
                }
                $zip_code.val(data.zonecode);
                $addr1.val(addr);
            }
        }).open();
    });
    let chk = false;
    $(".opt-email-type").change(function () {
        var tag_id = $(this).attr("id");
        var email_type = $(this).val();
        if (email_type === 'etc') {
            $("#" + tag_id + "_email_type").prop("readonly", false);
            if(chk){
                $("#" + tag_id + "_email_type").prop("readonly", false).val("");
            }
        } else {
            $("#" + tag_id + "_email_type").prop("readonly", true).val(email_type);
            chk = true;
        }
    }).change();



    $('.only-num').keydown(function (e) {
        fn_Number($(this), e);
    }).keyup(function (e) {
        fn_Number($(this), e);
    }).css('imeMode', 'disabled');


    // load_simple_gallery();
    // load_detail_gallery();
    // load_collage_gallery();

    /* 네이버 지도 */
    $(".naver_map").each(function () {
        initNaverMap($(this));
    });

    $(".naver_map_pano").each(function () {
        var naver_map = $(this).attr('id');
        var lat = $(this).data('mapLat');
        var lng = $(this).data('mapLng');
        var zoom = $(this).data('mapLev');


        var pano = null;

        function initPanorama() {
            pano = new naver.maps.Panorama("pano", {
                position: new naver.maps.LatLng(lat, lng),
                pov: {
                    pan: 55,
                    tilt: -30,
                    fov: 100
                },
                zoomControl: true,
            });

            naver.maps.Event.addListener(pano, "init", function () {
                marker.setMap(pano);

                var proj = pano.getProjection();
                var lookAtPov = proj.fromCoordToPov(marker.getPosition());
                if (lookAtPov) {
                    pano.setPov(lookAtPov);
                }
            });
        }

        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng)
        });

        initPanorama();

    });
    $(".google_map").each(function () {
        initGoogleMap($(this));
    });

    $(".kakao_map").each(function () {
        initKakaoMap($(this));
    });


    $(".kakao_map_road").each(function () {
        var kakao_map = $(this).attr('id');
        var lat = $(this).data('mapLat');
        var lng = $(this).data('mapLng');
        var zoom = $(this).data('mapLev');
        console.log(lat + "/" + lng);

        //---------------------------------------

        //----------------------------------------

        var rvContainer = document.getElementById('kakao_road'); // 로드뷰를 표시할 div

        var rv = new kakao.maps.Roadview(rvContainer, {
            pan: 28, // 로드뷰 처음 실행시에 바라봐야 할 수평 각
            tilt: 1, // 로드뷰 처음 실행시에 바라봐야 할 수직 각
            zoom: 0 // 로드뷰 줌 초기값
        }); // 로드뷰 객체 생성
        var rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성 
        var rvPosition = new kakao.maps.LatLng(lat, lng);

        rc.getNearestPanoId(rvPosition, 50, function (panoid) {
            rv.setPanoId(panoid, rvPosition);//좌표에 근접한 panoId를 통해 로드뷰를 실행합니다.
        });

        // 로드뷰 초기화 이벤트
        kakao.maps.event.addListener(rv, 'init', function () {

            // 로드뷰에 올릴 마커를 생성합니다.
            var rMarker = new kakao.maps.Marker({
                position: rvPosition,
                map: rv //map 대신 rv(로드뷰 객체)로 설정하면 로드뷰에 올라갑니다.
            });
            rMarker.setAltitude(2); //마커의 높이를 설정합니다. (단위는 m입니다.)
            rMarker.setRange(100); //마커가 보일 수 있는 범위를 설정합니다. (단위는 m입니다.)

            // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정합니다.
            var projection = rv.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.

            // 마커의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
            var viewpoint = projection.viewpointFromCoords(rMarker.getPosition(), rMarker.getAltitude());
            viewpoint.tilt = 0;
            viewpoint.zoom = -3;
            rv.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.
        });

    })

    var get_token = getTokens();
    if (get_token.hasOwnProperty('section_no')) {
        var offset = $("#section_" + get_token.section_no).offset();
        $('html, body').animate({
            scrollTop: offset.top
        }, 0);
    }


    $(".popup-modal-btn").click(function () {
        var today_close = $(this).prevAll('input');
        if ($(today_close).is(":checked")) {
            popup_no = $(today_close).val();
            var cookie_popup = $.cookie('to_close');
            if (cookie_popup == undefined) {
                var arr_popup = [];
                arr_popup.push(Number(popup_no));
                var json_popup = JSON.stringify(arr_popup);
                $.cookie('to_close', json_popup, {
                    expires: 1
                });
            } else {
                var arr_popup = JSON.parse(cookie_popup);
                arr_popup.push(Number(popup_no));
                var json_popup = JSON.stringify(arr_popup);
                $.cookie('to_close', json_popup, {
                    expires: 1
                });
            }
        }

    });

    var cookie_popup = $.cookie('to_close');
    var arr_popup = [];
    if (cookie_popup != undefined) {
        arr_popup = JSON.parse(cookie_popup);
    }

    $.each($(".popup_modal"), function (idx, el) {
        popup_no = $(el).data('popup_no');
        if ($.inArray(popup_no, arr_popup) === -1) {
            $(el).modal('show');
        }
    });
});


$(document).on('click', '.save-form-btn', function () {
    var url = $(this).data('url');
    var form_id = $(this).data('form');
    $(".modal").modal("hide");
    var form = document.getElementById(form_id);
    var data = new FormData(form);
    $.ajax({
        type: "post",
        url: url,
        processData: false,
        contentType: false,
        data: data,
        dataType: 'Json',
        success: function (result) {
            if (result.code) {
                $('.modal').modal('hide');
                $(".valid-txt").hide();
                if (result.hasOwnProperty('redirect')) {
                    redirect = result.redirect;
                } else {
                    redirect = 'reload';
                }
                $('#modal_reload .modal-body').html("<div class='text-center'>" + result.message + "</div>");
                $("#modal_reload_btn").data("type", redirect);
                $('#modal_reload').modal('show');
            } else {
                if (result.hasOwnProperty('redirect')) {
                    redirect = result.redirect;
                } else {
                    redirect = 'none';
                }
                $('#modal_reload .modal-body').html("<div class='text-center'>" + result.message + "</div>");
                $("#modal_reload_btn").data("type", redirect);
                $('#modal_reload').modal('show');
                reloadCsrf();
                $(".valid-txt").hide();
                $.each(result.data, function (id, text) {
                    $("#valid_" + id).text(text);
                    $("#valid_" + id).show();
                });
            }
        }
    });
});

$(document).on('click', '.save-form-capcha-btn', function (e) {
    e.preventDefault();
    var capcha_g_id = $("#capcha_g_id").val();
    var url = $(this).data('url');
    var form_id = $(this).data('form');
    $(".modal").modal("hide");
    var form = document.getElementById(form_id);
    var data = new FormData(form);
    grecaptcha.ready(function () {
        try {
            grecaptcha.execute(capcha_g_id, {
                action: 'submit'
            }).then(function (token) {
                $.ajax({
                    type: "post",
                    url: url,
                    processData: false,
                    contentType: false,
                    data: data,
                    dataType: 'Json',
                    success: function (result) {
                        if (result.code) {
                            $('.modal').modal('hide');
                            $(".valid-txt").hide();
                            if (result.hasOwnProperty('redirect')) {
                                redirect = result.redirect;
                            } else {
                                redirect = 'reload';
                            }
                            $('#modal_reload .modal-body').html("<div class='text-center'>" + result.message + "</div>");
                            $("#modal_reload_btn").data("type", redirect);
                            $('#modal_reload').modal('show');
                        } else {
                            if (result.hasOwnProperty('redirect')) {
                                redirect = result.redirect;
                            } else {
                                redirect = 'none';
                            }
                            $('#modal_reload .modal-body').html("<div class='text-center'>" + result.message + "</div>");
                            $("#modal_reload_btn").data("type", redirect);
                            $('#modal_reload').modal('show');
                            reloadCsrf();
                            $(".valid-txt").hide();
                            $.each(result.data, function (id, text) {
                                $("#valid_" + id).text(text);
                                $("#valid_" + id).show();
                            });
                        }
                    }
                });
            });
        } catch (err) {
            $('#modal_reload .modal-body').html("<div class='text-center'>The captcha API is incorrect.<br/>Please check again.</div>");
            $("#modal_reload_btn").data("type", 'none');
            $('#modal_reload').modal('show');
        }
    });
});


function DatePicker(selector, date) {

    var DatePicker = tui.DatePicker;
    DatePicker.localeTexts['customKey'] = {
        titles: {
            // days
            DD: ['일', '월', '화', '수', '목', '금', '토'],
            // daysShort
            D: ['일', '월', '화', '수', '목', '금', '토'],
            // months
            MMMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            // monthsShort
            MMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        },
        titleFormat: 'yyyy년 MMM ',
        todayFormat: '오늘: yyyy년  MMMM dd일  DD요일',
        date: 'Date',
    };


    var datepicker = new tui.DatePicker('#' + selector + '_wrapper', {
        date: date,
        input: {
            element: '#' + selector,
            format: 'yyyy-MM-dd'
        },
        language: 'customKey',
    });

    return datepicker;
}

//TODO:  블럭별로 기능 분리
$(document).on('change', "[name='sort_key']", function (e) {
    var block_type = $(this).closest('.section').data('blockType');
    if (block_type == 'board') {
        if (typeof board_obj === "object") {
            board_obj.search_board(this);
        }
    } else if (block_type == 'gallery') {
        search_gallery(this);
    } else if (block_type == 'shop-board') {
        if (typeof shop_board_obj === "object") {
            shop_board_obj.search_shop(this);
        }
    }
});
$(document).on('change', "[name='board_type']", function (e) {

    let board_type = $(this).data("type");
    console.log(board_type)
    $(this).closest(".section").removeClass().addClass(board_type+" section block");
    $(this).closest(".section").find('.radio-button').removeClass('active');
    $(this).closest('.radio-button').addClass('active');

    if(board_type != "board5" && board_type != "board6"){
        board_type = "board";
    }

    $(this).closest(".section-inner").find(".board-wrap-con").removeClass().addClass(board_type+"-wrap board-wrap-con");
    
    if(board_type == "board5"){
        $(this).closest(".board-wrap-con").addClass("gal-warp");
    }
    if($(this).val() == "main_board"){
        $(this).closest(".section-inner").find(".main-board").show();
        $(this).closest(".section-inner").find(".sub-board").hide();
    }else{
        $(this).closest(".section-inner").find(".main-board").hide();
        $(this).closest(".section-inner").find(".sub-board").show();
    }
});
//TODO:  블럭별로 기능 분리
$(document).on('change', "[name='category']", function (e) {
    var block_type = $(this).closest('.section').data('blockType');
    if (block_type == 'board') {
        if (typeof board_obj === "object") {
            board_obj.search_board(this);
        }
    } else if (block_type == 'gallery') {
        gallery_obj.search_gallery(this);
    } else if (block_type == 'shop-board') {
        if (typeof shop_board_obj === "object") {
            shop_board_obj.search_shop(this);
        }
    }
});


function instaMore(el) {
    var count = Number($(el).data("show"));
    var i = 0;
    for (var i = 0; i < count; i++) {
        $(el).closest(".insta-wrap").find(".gal").not(":visible").eq(0).removeClass("d-none d-md-none");
        if ($(el).closest(".insta-wrap").find(".gal").not(":visible").length == 0) {

            $(el).hide();
        }
    }

}
$(document).ready(function () {
    $('.datepicker').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    $('.timepicker').datetimepicker({
        format: 'HH:mm'
    });
});

function initNaverMap(el) {
    var naver_map = $(el).attr('id');
    var lat = $(el).data('mapLat');
    var lng = $(el).data('mapLng');
    var zoom = $(el).data('mapLev');
    var naverMap = {
        center: new naver.maps.LatLng(lat, lng),
        //zoom: zoom, //지도의 초기 줌 레벨
    }

    var nMap = new naver.maps.Map(naver_map, naverMap);
    var nMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: nMap
    });
}


function initGoogleMap(el) {
    var google_map = $(el).attr('id');
    var lat = $(el).data('mapLat');
    var lng = $(el).data('mapLng');
    var zoom = $(el).data('mapLev');
    var container = document.getElementById(google_map); //지도를 담을 영역의 DOM 레퍼런스

    /* 구글지도 */
    var center = new google.maps.LatLng(lat, lng);
    var options = {
        disableDefaultUI: true,
        center: center, // 지도의 중심좌표
        zoom: 15, // 지도의 확대 레벨
        styles: [
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
            },
        ]
    };

    var google_map_obj = new google.maps.Map(container, options);

    var markerPosition = new google.maps.LatLng(lat, lng);
    // 마커를 생성합니다
    var marker = new google.maps.Marker({
        position: markerPosition
    });

    marker.setMap(google_map_obj);
}

function initKakaoMap(el) {
    var kakao_map = $(el).attr('id');
    var lat = $(el).data('mapLat');
    var lng = $(el).data('mapLng');
    var zoom = $(el).data('mapLev');
    var container = document.getElementById(kakao_map); //지도를 담을 영역의 DOM 레퍼런스
    /* 카카오지도 */
    //            var container = document.getElementById('kakao_map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(lat, lng), //지도의 중심좌표.
        //level: zoom //지도의 레벨(확대, 축소 정도)
    };
    var kMap = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    var markerPosition = new kakao.maps.LatLng(lat, lng);
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition
    });
    marker.setMap(kMap);
}

