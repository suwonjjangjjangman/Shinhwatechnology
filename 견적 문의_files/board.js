const board = function () {
    var board_paging = function (el, no) {
        var section_id = $(el).closest(".section").attr('id').toString();
        var section_no = section_id.replace('section_', '');
        $("#frm_" + section_no).find("input[name='page_no']").val(no);
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + '/board/ajaxboarddata',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let tmp_paging = $("<div>").html(result.data.board_html);
                    let tmp_remove_id = tmp_paging.find("#" + section_id);
                    tmp_remove_id.contents().unwrap();
                    let board_paging_html = tmp_paging.html(); 
                    $("#" + section_id).html(board_paging_html);
                    _customBlockInit(section_id);
                }
            }
        });
    }

    var more_paging = function (section_no, btn) {
        var type = $(btn).data('type');
        var section_id = $(btn).closest('.section').attr('id').toString();
        var section_no = section_id.replace("section_", "");

        var more = $("#section_" + section_no).find(".m-visible").data('more');
        if (more === false) {
            return false;
        }

        var page = Number($("#page_" + section_no).val()) + 1;
        $("#page_" + section_no).val(page)
        var data = $("#frm_" + section_no).serialize();
        data += '&paging_type=more';
        $.ajax({
            type: "get",
            url: getLocale() + "/board/ajaxboarddata",
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let data = result.data;
                    $("#page_" + section_no).val(page);

                    var more = false;
                    if (data.hasOwnProperty('more')) {
                        more = result.more;
                        delete result.more;
                    }

                    if (!data.more) {
                        $(btn).hide();
                    }

                    $("#section_" + section_no).find(".m-visible").data('more', more);
                    type = type.split("|")[0];
                    if (['board1', 'board1-custom'].includes(type) === true) {
                        $("#section_" + section_no).find(".m-visible").find('.table-wrap-m').append(result.data['board_html']);
                    } else if (['board2', 'board2-custom'].includes(type) === true) {
                        $("#section_" + section_no).find(".m-visible").find('.accordion').append(result.data['board_html']);
                    } else if (['board3', 'board3-custom'].includes(type) === true) {
                        $("#section_" + section_no).find(".m-visible").find('.table-wrap').append(result.data['board_html']);
                    } else if (['board4', 'board4-custom'].includes(type) === true) {
                        $("#section_" + section_no).find(".m-visible").find('.table-wrap').append(result.data['board_html']);
                    } else if (['board5', 'board5-custom' , 'board6'].includes(type) === true) {
                        $("#section_" + section_no).find(".m-visible").find('.row').append(result.data['board_html']);
                    }
                } else {
                    alert(LANGS.wrong_request)
                }
            }
        });
    }

    var search_board = function (el) {
        var section_id = $(el).closest(".section").attr('id').toString();
        var form_id = $(el).closest("form").attr('id');
        var section_no = $("#" + form_id).find("[name='section_no']").val();
        $("#page_" + section_no).val(1);
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + '/board/ajaxboarddata',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let tmp_paging = $("<div>").html(result.data.board_html);
                    let tmp_remove_id = tmp_paging.find("#" + section_id);
                    tmp_remove_id.contents().unwrap();
                    let board_paging_html = tmp_paging.html();
                    $("#" + section_id).html(board_paging_html);
                    $("#" + section_id).find('input[name="board_type"][value="main_board"]').prop('checked', true);
                    let board_type = new URLSearchParams(data).get("board_type")
                    $("#" + section_id).find('input[name="board_type"][value="'+board_type+'"]').prop('checked', true);
                    $("#" + section_id).find('input[name="board_type"][value="'+board_type+'"]').trigger("change");
                    _customBlockInit(section_id);
                }
            }
        });
    }

    var load_gallery = function () {
        // Init empty gallery array
        var container = new Array();
        container = [];
        // Loop over gallery items and push it to the array
        $('.board-view figure').each(function () {
            var url = $(this).find('.wrap').attr('href');
            $(this).css('background', 'url("' + url + '") center center / cover no-repeat');
            var $link = $(this).find('a'),
                item = {
                    src: $link.attr('href'),
                    w: $link.data('width'),
                    h: $link.data('height'),
                    title: $link.data('captionTitle'),
                };
            container.push(item);
        });
        return container;
    }

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
                    url: getLocale() + '/board/ajaxboardreply',
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
                    url: getLocale() + '/board/ajaxboardreply',
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
            url: getLocale() + '/board/ajaxBoardComment',
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
            url: getLocale() + '/board/ajaxboardreply',
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
            url: getLocale() + '/board/ajaxboardreply',
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

    var _customBlockInit = function (section_id) {
        //지도
        if ($("#" + section_id).find('.item-block').find(".map").length > 0) {
            const mapEl = $("#" + section_id).find('.item-block').find(".map");
            $.each(mapEl, function () {
                if ($(this).hasClass("naver_map") === true) {
                    initNaverMap($(this));
                } else if ($(this).hasClass("kakao_map") === true) {
                    initKakaoMap($(this));
                } else if ($(this).hasClass("google_map") === true) {
                    initGoogleMap($(this));
                }
            })
        }
    }

    $(document).ready(function () {
        load_gallery();
    });

    return {
        'board_paging': board_paging,
        'board_paging': board_paging,
        'search_board': search_board,
        'more_paging': more_paging,
        'more_reply_m': moreReplyM,
        'more_reply': moreReply,
        'open_mobile_comment': openMobileComment,
        'open_reply_write_m': openReplyWriteM,
        'view_reply': viewReply,
        'view_reply_m': viewReplyM,
        'close_reply': closeReply,
        'load_gallery': load_gallery,
    }
};