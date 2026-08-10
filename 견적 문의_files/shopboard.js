var shop_board = function () {
    var shop_paging = function (el, no) {
        var section_id = $(el).closest(".section").attr('id').toString();
        var section_no = section_id.replace('section_', '');
        $("#frm_" + section_no).find("input[name='page_no']").val(no);
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + '/shop/ajaxshopdata',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let tmp_paging = $("<div>").html(result.data.shop_html);
                    let tmp_remove_id = tmp_paging.find("#" + section_id);
                    tmp_remove_id.contents().unwrap();
                    let shop_paging_html = tmp_paging.html();
                    $("#" + section_id).html(shop_paging_html); 
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
        $.ajax({
            type: "get",
            url: getLocale() + "/shop/ajaxshop",
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

                    var html = [];
                    $.each(data.lists, function (idx, val) {
                        const dummy_shopboard = $("#section_" + section_no).find(".m-visible").find(".dummy-" + type).clone();
                        if (type === 'shop-board1') {
                            let mDisplay_x = $("#section_" + section_no).find(".m-visible").data('mDisplay_x');
                            dummy_shopboard.find(".gal").addClass("gal-" + mDisplay_x);
                        }
                        console.log(val.thumbnail)
                        dummy_shopboard.find(".shop_title").text(val.title);
                        dummy_shopboard.find(".p-summary").text(val.summary);
                        dummy_shopboard.find(".thumbnail").css("background-image", "url('/builder/img/shop/" + val.thumbnail + "')");
                        if (val.sale_allow === 'T') {
                            if (val.sale_price === '0') {
                                sale_per = 100;
                            } else {
                                sale_per = 100 - Math.ceil(100 / (Number(val.price) / Number(val.sale_price)));
                            }
                            dummy_shopboard.find(".sale-per").prepend(sale_per);
                            dummy_shopboard.find(".discount").show();
                            dummy_shopboard.find(".old-price").text(Number(val.price).toLocaleString('ko-KR') + " " + LANGS.won).show();
                            dummy_shopboard.find(".price").text(Number(val.sale_price).toLocaleString('ko-KR') + " " + LANGS.won);
                            dummy_shopboard.find('.price_br').show()
                        } else {
                            dummy_shopboard.find(".price").text(Number(val.price).toLocaleString('ko-KR') + " " + LANGS.won);
                            dummy_shopboard.find('.price_br').hide()
                        }
                        dummy_shopboard.find(".view-btn").attr("href", val.link);
                        dummy_shopboard.find(".view-btn").attr("target", val.target);
                        html.push(dummy_shopboard.html())
                    });

                    if (type === 'shop-board1' || type === 'shop-board3') {
                        $("#section_" + section_no).find(".m-visible").find('.row').append(html.join(''));
                    } else if (type === 'shop-board2') {
                        $("#section_" + section_no).find(".m-visible").find('.table-wrap').append(html);
                    }
                } else {
                    alert(LANGS.wrong_request)
                }
            }
        });
    }

    var search_shop = function (el) {
        var section_id = $(el).closest(".section").attr('id').toString();
        var form_id = $(el).closest("form").attr('id');
        var section_no = $("#" + form_id).find("[name='section_no']").val();
        $("#page_" + section_no).val(1);
        var data = $("#frm_" + section_no).serialize();
        $.ajax({
            type: "get",
            url: getLocale() + '/shop/ajaxshopdata',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'Json',
            success: function (result) {
                if (result.code === true) {
                    let tmp_paging = $("<div>").html(result.data.shop_html);
                    let tmp_remove_id = tmp_paging.find("#" + section_id);
                    tmp_remove_id.contents().unwrap();
                    let shop_paging_html = tmp_paging.html();
                    $("#" + section_id).html(shop_paging_html); 
                }
            }
        });

    }
    return {
        'shop_paging': shop_paging,
        'search_shop': search_shop,
        'more_paging': more_paging
    }
};


