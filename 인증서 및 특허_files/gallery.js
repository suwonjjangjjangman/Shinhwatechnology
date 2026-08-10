var gallery = function () {
    //페이징
    var fetch = false

    var gallery_paging = function (el, no) {
        var section_id = $(el).closest(".section").attr('id').toString();
        var section_no = section_id.replace('section_', '');
        $("#frm_" + section_no).find("input[name='page_no']").val(no);
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + '/gallery/ajaxgallerydata',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let tmp_paging = $("<div>").html(result.data.gallery_html);
                    let tmp_remove_id = tmp_paging.find("#" + section_id);
                    tmp_remove_id.contents().unwrap();
                    let gallery_paging_html = tmp_paging.html(); 
                    $("#" + section_id).html(gallery_paging_html);
                }
            }
        });
    }

    //모바일 페이징
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
        $.ajax({
            type: "get",
            url: getLocale() + "/gallery/ajaxgallery",
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let data = result.data;
                    $("#page_" + section_no).val(page);

                    if (!data.more) {
                        $(btn).hide();
                    }

                    $("#section_" + section_no).find(".m-visible").data('more', data.more);

                    var html = [];
                    $.each(data.lists, function (idx, val) {
                        const dummy_gallery = $("#section_" + section_no).find(".m-visible").find(".dummy-" + type).clone();
                        dummy_gallery.find(".figure-wrap").find(".wrapper").css("background-image", "url('" + val.server_file_name + "') center center / cover no-repeat;");
                        dummy_gallery.find(".figure-wrap").find(".wrap").attr("href", val.server_file_name);
                        dummy_gallery.find(".figure-wrap").find(".wrap").attr("data-caption-title", val.title);
                        dummy_gallery.find(".figure-wrap").find(".wrap").attr("data-caption-description", val.contents);
                        dummy_gallery.find(".figure-wrap").find(".wrap").attr("data-gallery-no", val.no);
                        dummy_gallery.find(".figure-wrap").find(".wrap").attr("data-width", val.size[0]);
                        dummy_gallery.find(".figure-wrap").find(".wrap").attr("data-height", val.size[1]);
                        dummy_gallery.find(".caption-title").text(val.title);
                        dummy_gallery.find(".caption-description").text(val.contents);
                        dummy_gallery.find(".view-btn").attr("href", val.link);
                        dummy_gallery.find(".view-btn").attr("target", val.target);
                        html.push(dummy_gallery.html())
                    });

                    if (type === 'gallery1') {
                        $("#section_" + section_no).find(".m-visible").find('.row').append(html);
                        load_simple_gallery();
                    } else if (type === 'gallery2') {
                        $("#section_" + section_no).find(".m-visible").find('.contents').append(html);
                        load_detail_gallery();
                    }
                } else {
                    alert(LANGS.wrong_request)
                }
            }
        });
    }

    //검색
    var search_gallery = function (el) {
        var section_id = $(el).closest(".section").attr('id').toString();
        var form_id = $(el).closest("form").attr('id');
        var section_no = $("#" + form_id).find("[name='section_no']").val();
        $("#page_" + section_no).val(1);
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + '/gallery/ajaxgallerydata',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let tmp_paging = $("<div>").html(result.data.gallery_html);
                    let tmp_remove_id = tmp_paging.find("#" + section_id);
                    tmp_remove_id.contents().unwrap();
                    let gallery_paging_html = tmp_paging.html(); 
                    $("#" + section_id).html(gallery_paging_html);
                }
            }
        });

    }


    // 상세
    var show_gallery = function (event) {
        event.preventDefault();
        let div = 'pc';
        if ($(this).closest('.m-visible').length > 0) {
            div = 'm';
        } else {
            div = 'pc';
        }
        const id = $(this).closest('.section').attr('id');
        const type = $(this).closest('.section').data('blockId');
        let container = [];
        let index = 0;

        if (type === 'gallery1') {
            container = load_simple_gallery();
            index = $(this).closest('.gal').index();
        } else if (type === 'gallery2') {
            container = load_detail_gallery();
            index = $(this).closest('.gal').index();

        } else if (type === 'gallery3') {
            container = load_collage_gallery();
            index = $(this).data('num');
        }

        // Define object and gallery options
        var $pswp = $('.pswp')[0],
            options = {
                index: index,
                bgOpacity: 0.85,
                showHideOpacity: true,
                closeOnScroll: false,
            };
        var gallery = new PhotoSwipe($pswp, PhotoSwipeUI_Default, container[id][div], options);
        gallery.init();
    }


    //gallery3 페이징
    var masonry_gallery_paging = function (section_no) {
        var visible = checkVisible($("#section_" + section_no).find(".collage-group-914").find("figure:last"), 'visible');
        var more = $("#section_" + section_no).data('more');
        if (more === false) {
            return false;
        }
        if (visible === false && fetch === false) {
            return false;
        }
        var page = Number($("#page_" + section_no).val());
        $("#page_" + section_no).val(page + 1)
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + "/gallery/ajaxgallery",
            processData: false,
            contentType: false,
            async: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let data = result.data;
                    $("#section_" + section_no).data('more', data.more);
                    const pc_col_group = $("#section_" + section_no).find(".pc-visible").find(".collage-group-" + section_no);
                    const m_col_group = $("#section_" + section_no).find(".m-visible").find(".collage-group-" + section_no);

                    var pc_coll_cnt = pc_col_group.length;
                    var m_coll_cnt = m_col_group.length;
                    var html = [];
                    var i = 0;
                    var m = 0;
                    $.each(data.lists, function (idx, val) {
                        const dummy_gallery = $("#section_" + section_no).find(".m-visible").find(".dummy-gallery3").clone();
                        dummy_gallery.find(".wrapper").find("img").attr("src", val.server_file_name);
                        dummy_gallery.find(".wrapper").find("img").attr("alt", val.contents);
                        dummy_gallery.find(".wrapper").find(".wrap").attr("href", val.server_file_name);
                        dummy_gallery.find(".wrapper").find(".wrap").attr("data-caption-title", val.title);
                        dummy_gallery.find(".wrapper").find(".wrap").attr("data-caption-description", "<div class=\'title\'>" + val.title + "</div><div>" + val.contents + "</div>");
                        dummy_gallery.find(".wrapper").find(".wrap").attr("data-gallery-no", val.no);
                        dummy_gallery.find(".wrapper").find(".wrap").attr("data-width", val.size[0]);
                        dummy_gallery.find(".wrapper").find(".wrap").attr("data-height", val.size[1]);
                        dummy_gallery.find(".caption-title").text(val.title);
                        dummy_gallery.find(".caption-description").text(val.contents);
                        html.push(dummy_gallery.html())
                        if (i > pc_coll_cnt) {
                            i = 0;
                        }
                        if (m > m_coll_cnt) {
                            m = 0;
                        }
                        var pc_height = [];
                        var m_height = [];

                        $.each(pc_col_group, function (k, v) {
                            pc_height[k] = $(v).innerHeight();
                        });

                        $.each(m_col_group, function (c, n) {
                            m_height[c] = $(n).innerHeight();
                        });

                        var pc_max_height = Math.max.apply(null, pc_height);
                        var pc_min_height = Math.min.apply(null, pc_height);
                        var m_max_height = Math.max.apply(null, m_height);
                        var m_min_height = Math.min.apply(null, m_height);

                        if ((pc_max_height - pc_min_height) > 700) {
                            i = pc_height.indexOf(pc_min_height);
                        }
                        if ((m_max_height - m_min_height) > 150) {
                            m = m_height.indexOf(m_min_height);
                        }
                        pc_col_group.eq(i).append(html[idx]);
                        m_col_group.eq(m).append(html[idx]);
                        i++;
                        m++;
                    });
                    load_collage_gallery();
                } else {
                    alert(LANGS.wrong_request)
                }
            },
        });
    }

    //갤러리 2타입 초기화
    var load_detail_gallery = function () {
        var container = [];
        var id = '';

        $(".gallery2").each(function () {
            id = $(this).attr('id');
            container[id] = ['pc', 'm'];
            container[id]['pc'] = [];
            container[id]['m'] = [];
            // Loop over gallery items and push it to the array
            $(this).find(".pc-visible").find('.grid-gallery-b').find('figure:visible').each(function () {
                var url = $(this).find('.wrap').attr('href');
                $(this).css('background', 'url("' + url + '") center center / cover no-repeat');
                var $link = $(this).find('a'),
                    item = {
                        src: $link.attr('href'),
                        w: $link.data('width'),
                        h: $link.data('height'),
                        title: $link.data('captionTitle')
                    };
                container[id]['pc'].push(item);
            });
            $(this).find(".m-visible").find('.grid-gallery-b').find('figure:visible').each(function () {
                var url = $(this).find('.wrap').attr('href');
                $(this).css('background', 'url("' + url + '") center center / cover no-repeat');
                var $link = $(this).find('a'),
                    item = {
                        src: $link.attr('href'),
                        w: $link.data('width'),
                        h: $link.data('height'),
                        title: $link.data('captionTitle')
                    };
                container[id]['m'].push(item);
            });
        });
        return container;
    }

    //갤러리 1타입 초기화
    var load_simple_gallery = function () {

        // Init empty gallery array
        var container = [];
        var id = '';
        $(".gallery1").each(function () {
            id = $(this).attr('id');
            container[id] = ['pc', 'm'];
            container[id]['pc'] = [];
            container[id]['m'] = [];

            $(this).find('.pc-visible').find('.grid-gallery-a').find('figure:visible').each(function () {
                var url = $(this).find('.wrap').attr('href');
                $(this).css('background', 'url("' + url + '") center center / cover no-repeat');
                var $link = $(this).find('a'),
                    item = {
                        src: $link.attr('href'),
                        w: $link.data('width'),
                        h: $link.data('height'),
                        title: $link.data('captionTitle')
                    };
                container[id]['pc'].push(item)
            });

            $(this).find(".m-visible").find('.grid-gallery-a').find('figure:visible').each(function () {
                var url = $(this).find('.wrap').attr('href');
                $(this).css('background', 'url("' + url + '") center center / cover no-repeat');
                var $link = $(this).find('a'),
                    item = {
                        src: $link.attr('href'),
                        w: $link.data('width'),
                        h: $link.data('height'),
                        title: $link.data('captionTitle')
                    };
                container[id]['m'].push(item)
            });
        });
        return container;
    }

    //갤러리 3타입 초기화
    var load_collage_gallery = function () {
        // Init empty gallery array
        var container = [];
        var id = '';
        $(".gallery3").each(function () {
            id = $(this).attr('id');
            container[id] = ['pc', 'm'];
            container[id]['pc'] = [];
            container[id]['m'] = [];
            var num = 0;
            $(this).find('.masonry-gallery').find(".pc-visible").find('.gal').each(function (idx, el) {
                $(el).find('figure').each(function (i) {
                    var $link = $(this).find('a'),
                        item = {
                            src: $link.attr('href'),
                            w: $link.data('width'),
                            h: $link.data('height'),
                            title: $link.data('captionTitle')
                        };

                    $link.data('num', num);
                    num++;
                    container[id]['pc'].push(item);
                });
            });
            var num = 0;
            $(this).find('.masonry-gallery').find(".m-visible").find('.gal').each(function (idx, el) {
                $(el).find('figure').each(function (i) {
                    var $link = $(this).find('a'),
                        item = {
                            src: $link.attr('href'),
                            w: $link.data('width'),
                            h: $link.data('height'),
                            title: $link.data('captionTitle')
                        };
                    $link.data('num', num);
                    num++;
                    container[id]['m'].push(item);
                });
            });
        });
        return container;
    }



    var boot = function () {
        load_simple_gallery();
        load_detail_gallery();
        load_collage_gallery();

        //상세
    }

    $(document).ready(function () {
        boot();
        $(document).on("click", ".gallery .wrap", show_gallery);
    });



    return {
        'gallery_paging': gallery_paging,
        'search_gallery': search_gallery,
        'more_paging': more_paging,
        'masonry_gallery_paging': masonry_gallery_paging,
    }
};


