const map_board = function () {

    var moreReplyM = function (el) {
        var more = $(el).attr('data-more');
        var comment_no = $(el).attr('data-no');
        var page_no = Number($("#replySortBoxM").find("input[name='page_no']").val()) + 1;
        var sort_btn = $("#replySortBoxM").find(".reply-sort-type");
        var sort = '';
        $.each(sort_btn, function () {
            if ($(this).hasClass('active')) {
                sort = $(this).val();
            }
        });
        var visible = checkVisible($(el).find("li:last"), 'visible');
        if (visible === true) {
            visible = false;
            if (more == 'true') {
                $.ajax({
                    type: "Get",
                    url: getLocale() + '/mapboard/ajaxboardreply',
                    data: 'comment_index=1' + '&comment_no=' + comment_no + '&page_no=' + page_no + '&sort=' + sort,
                    dataType: 'Json',
                    async: false,
                    success: function (result) {
                        if (result.code) {
                            let lists = result.data['lists'];
                            let more = result.data['more'];
                            const html = _makeReplyHtml(lists);
                            $("#replyCommentM").append(html);
                            const DetailCommentM = document.getElementById('DetailCommentM');
                            DetailCommentM.dataset.more = more;
                            DetailCommentM.dataset.no = comment_no;
                        }
                    }
                })
                $("#replySortBoxM").find("input[name='page_no']").val(page_no)
            }
        }
    }

    //답글 더보기
    var moreReply = function (el, comment_no) {
        var more = $(el).attr('data-more');
        var page_no = Number($("#replySortBox" + comment_no).find("input[name='page_no']").val()) + 1;
        var sort_btn = $("#replySortBox" + comment_no).find(".reply-sort-type");
        var sort = '';
        $.each(sort_btn, function () {
            if ($(this).hasClass('active')) {
                sort = $(this).val();
            }
        });
        var visible = checkVisible($(el).find("li:last"), 'visible');
        if (visible === true) {
            visible = false;
            if (more == 'true') {
                $.ajax({
                    type: "Get",
                    url: getLocale() + '/mapboard/ajaxboardreply',
                    data: 'comment_index=1' + '&comment_no=' + comment_no + '&page_no=' + page_no + '&sort=' + sort,
                    dataType: 'Json',
                    async: false,
                    success: function (result) {
                        if (result.code) {
                            let lists = result.data['lists'];
                            let more = result.data['more'];
                            const html = _makeReplyHtml(lists);
                            $("#replyList" + comment_no).append(html);
                            const replySortBox = document.getElementById('replyList' + comment_no);
                            replySortBox.dataset.more = more;
                        }
                    }
                })
                $("#replySortBox" + comment_no).find("input[name='page_no']").val(page_no)
            }
        }
    }

    //모바일용 댓글상세보기 출력
    var openMobileComment = function (el, comment_no) {
        $('.m-comment-wrap').addClass('on');
        $('html').addClass('comments-on');
        $.ajax({
            type: "Get",
            url: getLocale() + '/mapboard/ajaxBoardComment',
            data: 'no=' + comment_no,
            dataType: 'Json',
            success: function (result) {
                if (result.code) {
                    var writer = '';
                    if (result.data[0].post_master == 1) {
                        writer = result.data[0].user_name + '<label>' + getLangMsg('writer') + '</label>';
                    } else {
                        writer = result.data[0].user_name;
                    }
                    $("#mainCommentM").find(".name").html(writer);
                    $("#mainCommentM").find(".delete-btn").data('no', comment_no);
                    $("#mainCommentM").find(".contents").text(result.data[0].contents);
                    $("#mainCommentM").find(".date").text(result.data[0].insert_date);
                    $("#mainCommentM").find(".reply-cnt").text(result.data[0].reple_cnt);
                    if (result.data[0].reple_cnt > 0) {
                        $("#mainCommentM").find(".reply-info").show()
                    } else {
                        $("#mainCommentM").find(".reply-info").hide()
                    }
                    var sort_btn = $("#replySortBoxM").find(".reply-sort-type");
                    var sort = '';
                    $.each(sort_btn, function () {
                        if ($(this).hasClass('active')) {
                            sort = $(this).val();
                        }
                    });
                    // var page_no = $("#replySortBoxM").find("input[name='page_no']").val();
                    var comment_index = Number(result.data[0].comment_index);
                    viewReplyM(comment_index, comment_no, 1, sort, el);
                } else {
                    alert(result.message);
                }

            }
        });
    }


    //모바일용 답글쓰기 출력
    var openReplyWriteM = function () {
        $('.m-comment-wrap, .m-comment-write-wrap').addClass('on');
        $('html').addClass('comments-on');
        var comment_no = $("#replySortBoxM").find("input[name='comment_no']").val()
        $("#replyfrmM").find("input[name='comment_no']").val(comment_no);
    }

    //모바일용 답글출력
    var viewReplyM = function (comment_index, comment_no, page_no = 1, sort = 1, el = null) {
        $("#replySortBoxM").find("button").focus();
        $.ajax({
            type: "Get",
            url: getLocale() + '/mapboard/ajaxboardreply',
            data: 'comment_index=' + (comment_index + 1) + '&comment_no=' + comment_no + '&sort=' + sort,
            dataType: 'Json',
            success: function (result) {
                if (result.code) {
                    let lists = result.data['lists'];
                    let more = result.data['more'];
                    const html = _makeReplyMHtml(lists);
                    $("#replyCommentM").html(html);
                    const DetailCommentM = document.getElementById('DetailCommentM');
                    DetailCommentM.dataset.more = more;
                    DetailCommentM.dataset.no = comment_no;

                    $("#replySortBoxM").show();
                } else {
                    $("#replyCommentM").html('');

                }
                $("#replySortBoxM").find("input[name='page_no']").val(page_no);
                $("#replySortBoxM").find("input[name='comment_no']").val(comment_no);

            }
        });
    }

    //답글출력
    var viewReply = function (comment_index, comment_no, page_no = 1, sort = 'old', el = null) {
        $.ajax({
            type: "Get",
            url: getLocale() + '/mapboard/ajaxboardreply',
            data: 'comment_index=' + (comment_index + 1) + '&comment_no=' + comment_no + '&sort=' + sort,
            dataType: 'Json',
            success: function (result) {
                if (result.code) {
                    let lists = result.data['lists'];
                    let more = result.data['more'];
                    const html = _makeReplyHtml(lists);
                    const replySortBox = document.getElementById('replyList' + comment_no);
                    replySortBox.dataset.more = more;
                    if (el != null) {
                        if ($(el).hasClass('reply-sort-type')) {
                            $(el).parent().find('.reply-sort-type').removeClass('active');
                            $(el).addClass('active');
                        } else {

                            $(el).hide();
                            $(el).next('button').show();
                        }
                        $("#replyList" + comment_no).html(html);
                        $("#replyList" + comment_no).show();
                        $("#replySortBox" + comment_no).show();
                    }
                } else {
                    $("#replyList" + comment_no).html('');
                }

                $("#replySortBox" + comment_no).find("input[name='page_no']").val(page_no);
            }
        });
    }

    //답글 닫기
    var closeReply = function (el, comment_no) {
        $("#replyList" + comment_no).html('');
        $("#replyList" + comment_no).hide();
        $("#replySortBox" + comment_no).hide();
        $(el).prev('button').show();
        $(el).hide();
    }
    //답글 html 생성
    var _makeReplyHtml = function (obj) {
        var html = '';
        $.each(obj, function (idx, val) {
            post_master = '';
            if (val.post_master == 1) {
                post_master = '<label>' + LANGS.writer + '</label>';
            }
            html += '<li class="comments-level-2">';
            html += '    <div class="info">';
            html += '        <span class="name">' + val.user_name + ' ' + post_master + '</span>';
            html += '        <div class="btn-list">';
            if (val.mod_perm) {
                html += '            <button type="button" class="btn text-btn delete-btn" data-toggle="modal" data-target="#modal2" data-no="' + val.no + '">' + LANGS.delete + '</button>';
            }
            html += '        </div>';
            html += '    </div>';
            html += '    <div class="contents">' + val.contents + '</div>';
            html += '    <div class="bottom">';
            html += '        <span class="date">' + val.insert_date + '</span>';
            html += '    </div>';
            html += '</li>';
        });
        return html;
    }
    //답글 모바일용 html 생성
    var _makeReplyMHtml = function (obj) {
        var html = '';
        $.each(obj, function (idx, val) {
            post_master = '';
            if (val.post_master == 1) {
                post_master = '<label>' + LANGS.writer + '</label>';
            }
            html += '<li class="comments-level-2">';
            html += '    <div class="info">';
            html += '        <span class="name">' + val.user_name + ' ' + post_master + '</span>';
            html += '        <div class="btn-list">';
            if (val.mod_perm) {
                html += '            <button type="button" class="btn text-btn delete-btn" data-toggle="modal" data-target="#modal2" data-no="' + val.no + '">' + LANGS.delete + '</button>';
            }
            html += '        </div>';
            html += '    </div>';
            html += '    <div class="contents">' + val.contents + '</div>';
            html += '    <div class="bottom">';
            html += '        <span class="date">' + val.insert_date + '</span>';
            html += '    </div>';
            html += '</li>';
        });
        return html;
    }

    var save_map_board = function (form_id) {
        $(".modal").modal("hide");
        var direct = $("#direct_input").is(":checked");
        if (direct === true) {
            var address = $("#address").val();
            geocoder.geocode({
                'address': address
            }, googlePlacesSearchCB);
            return false;
        }

        _submitMapBoard(form_id);
    }
    var _submitMapBoard = function (form_id) {
        var form = document.getElementById(form_id);
        var data = new FormData(form);
        var url = $("#" + form_id).attr('action');
        $.ajax({
            type: "post",
            url: url,
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                $('.modal').modal('hide');
                $('#modal_reload .modal-body').html("<div class='text-center'>" + result.message + "</div>");
                if (result.code) {
                    $('.modal').modal('hide');
                    if (result.hasOwnProperty('redirect')) {
                        redirect = result.redirect;
                    } else {
                        redirect = 'reload';
                    }
                    $("#modal_reload_btn").data("type", redirect);
                } else {
                    reloadCsrf();
                    $("#modal_reload_btn").data("type", "none");
                    $(".text-danger").hide();
                    $.each(result.data, function (id, text) {
                        $("#valid_" + id).text(text);
                        $("#valid_" + id).show();
                    });
                    var valid_id = Object.keys(result.data)[0];
                    $("[name='" + valid_id + "']").focus();
                }
                $('#modal_reload').modal('show');
            }
        });
    }


    var captcha_map_board = function (form_id, capcha_g_id) {
        grecaptcha.ready(function () {
            try {
                grecaptcha.execute(capcha_g_id, {
                    action: 'submit'
                }).then(function (token) {
                    save_map_board(form_id);
                });
            } catch (err) {
                $('#modal_reload .modal-body').html("<div class='text-center'>The captcha API is incorrect.<br/>Please check again.</div>");
                $("#modal_reload_btn").data("type", 'none');
                $('#modal_reload').modal('show');
            }
        });
    }

    function gallery_upload(it) {
        $(it).closest('.gal-upload-box').find('.MultiFile-wrap').find("input[name='gallery_file[]']").last().click();
    }

    var board_type = $("#board_type").val();
    var geocoder = null;
    if (board_type == 'kakao-map') {
        geocoder = new kakao.maps.services.Geocoder();
    } else if (board_type == 'google-map') {
        geocoder = new google.maps.Geocoder();
    }
    var searchAddr = function () {
        var direct = $("#direct_input").is(":checked");
        if (direct === true) {
            return false;
        }
        address = $("#address");
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
                if (board_type == 'kakao-map') {
                    geocoder.addressSearch(addr, kakaoPlacesSearchCB);
                } else if (board_type == 'naver-map') {
                    naver.maps.Service.geocode({
                        query: addr
                    }, naverPlacesSearchCB);
                } else if (board_type == 'google-map') {
                    geocoder.geocode({
                        'address': addr
                    }, googlePlacesSearchCB);
                }
                address.val(addr);
            }
        }).open();
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function kakaoPlacesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            var lat = data[0].y;
            var lng = data[0].x;
            $("input[name='lng']").val(lng);
            $("input[name='lat']").val(lat);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            return alert(getLangMsg('not-found-addr-geocode'));

        } else if (status === kakao.maps.services.Status.ERROR) {
            return alert(getLangMsg('search-error-result'));
        }
    }

    function naverPlacesSearchCB(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            if (!address) {
                return alert('Geocode Error, Please check address');
            }
            return alert(getLangMsg('search-error-result'));
        }
        if (response.v2.meta.totalCount === 0) {
            return alert(getLangMsg('not-found-addr-geocode'));
        }
        var data = response.v2.addresses[0];
        var lat = data.y;
        var lng = data.x;
        $("input[name='lng']").val(lng);
        $("input[name='lat']").val(lat);
    }

    function googlePlacesSearchCB(response, status) {
        if (status == 'OK') {
            var data = response[0].geometry.location;
            var lat = data.lat();
            var lng = data.lng();
            $("input[name='lng']").val(lng);
            $("input[name='lat']").val(lat);


            var direct = $("#direct_input").is(":checked");
            if (direct === true) {
                _submitMapBoard("form1");
            }
        } else {
            return alert(getLangMsg('not-found-addr-geocode'));
        }
    }
    var setEventListener = function () {

        $(".upload-gal-list ul").sortable({
            placeholder: 'placeholder',
            cancel: 'disabled',
        }).disableSelection();

        var direct = $("#direct_input").is(":checked");

        $("#direct_input").click(function () {
            direct = $(this).is(":checked");
            if (direct === true) {
                $("#address").prop("readonly", false);
                $("#address").removeClass("readonly");
            } else {
                $("#address").prop("readonly", true);
                $("#address").addClass("readonly")
            }
        });
    };

    $(document).ready(function () {
        setEventListener();
    });

    return {
        'save_map_board': save_map_board,
        'captcha_map_board': captcha_map_board,
        'gallery_upload': gallery_upload,
        'googlePlacesSearchCB': googlePlacesSearchCB,
        'naverPlacesSearchCB': naverPlacesSearchCB,
        'kakaoPlacesSearchCB': kakaoPlacesSearchCB,
        'searchAddr': searchAddr,
        'more_reply_m': moreReplyM,
        'more_reply': moreReply,
        'open_mobile_comment': openMobileComment,
        'open_reply_write_m': openReplyWriteM,
        'view_reply': viewReply,
        'view_reply_m': viewReplyM,
        'close_reply': closeReply,
    }


};

