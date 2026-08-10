let ckeditor_content;

export function get_ckeditor_content(){
    let tmp_content = ckeditor_content.getData();
    if (/<script/i.test(tmp_content)) {
        tmp_content = tmp_content.replace(/<script\b[^>]*>/gi, '<p>').replace(/<\/script>/gi, '</p>');
    }    
    return tmp_content;
}

window.get_ckeditor_content = get_ckeditor_content;

$(document).ready(function () {
    $('oembed').each(function() {
        var url = $(this).attr('url');
        var oembedhtml = $(this);
        if (url) {
            $.ajax({
                url: '/board/boardEmbed',
                type: 'GET',
                data: {
                    url: url
                },
                success: function(data) {
                    data = JSON.parse(data);
                    if(!data.result){
                        let url2 = data.url;
                        $.ajax({
                            url: url2,
                            type: 'GET',
                            success: function(data2) {
                                oembedhtml.html(data2.html);
                            },
                            error: function() {
                                oembedhtml.html('<p style="text-align:center;">미디어 불러오기에 실패하였습니다.</p>');
                            }
                        });
                    }else{
                        oembedhtml.html(data.html);
                    }
                },
                error: function() {
                    oembedhtml.html('<p style="text-align:center;">미디어 불러오기에 실패하였습니다.</p>');
                }
            });
        }
    });
})

import {
    ClassicEditor,Essentials,Bold,Italic,Font,Paragraph,FindAndReplace,SelectAll,Heading,Strikethrough,
    Underline,RemoveFormat,TodoList,Indent,Undo,FontSize,FontFamily,FontColor,FontBackgroundColor,Highlight,
    Alignment,Link,List,ImageUpload,BlockQuote,MediaEmbed,Code,CodeBlock,SpecialCharacters,HorizontalLine,
    PageBreak,HtmlEmbed,SourceEditing,ImageInsertUI,SimpleUploadAdapter,Image,Table,TableCaption,TableCellProperties,
    TableColumnResize,TableProperties,TableToolbar,ImageResizeEditing, ImageResizeHandles,ImageBlock,ImageCaption,
	ImageInline,ImageInsert,ImageInsertViaUrl,ImageResize,ImageStyle,ImageTextAlternative,ImageToolbar,Markdown,
    PasteFromMarkdownExperimental,Autoformat,GeneralHtmlSupport
} from '/static/js/ckeditor/ckeditor5.js';
var locale = getLocale().toString().replace('/', '');
var lang = 'ko';
if (locale == 'en') {
    lang = 'en';
}

ClassicEditor
    .create( document.querySelector( '#contents' ), {
        plugins: [
            Essentials, Bold, Italic, Font, Paragraph, FindAndReplace, SelectAll, Heading, Strikethrough,
            Underline, RemoveFormat, TodoList, Indent, Undo, FontSize, FontFamily, FontColor, FontBackgroundColor,
            Highlight, Alignment, Link, ImageUpload, BlockQuote, MediaEmbed, Code, CodeBlock, SpecialCharacters,
            HorizontalLine, PageBreak, HtmlEmbed, SourceEditing,ImageInsertUI , SimpleUploadAdapter,Image,Table,
            TableCaption,TableCellProperties,TableColumnResize,TableProperties,TableToolbar ,ImageResizeEditing,
            ImageResizeHandles,ImageBlock,ImageCaption,ImageInline,ImageInsert,ImageInsertViaUrl,ImageResize,
            ImageStyle,ImageTextAlternative,ImageToolbar,List,PasteFromMarkdownExperimental,Autoformat,GeneralHtmlSupport
        
        ],
        toolbar: {
            items: [
                'findAndReplace', 'selectAll', '|', 'heading', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'removeFormat', '|',
                'bulletedList', 'numberedList', 'todoList', '|','outdent', 'indent', '|','undo', 'redo',
                '-',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                'alignment', '|', 'link', 'uploadImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'code', 'codeBlock', '|',
                'specialCharacters', 'horizontalLine', 'pageBreak', '|','htmlEmbed', '|', 'sourceEditing'
            ],
            shouldNotGroupWhenFull: true
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ]
        },
        simpleUpload: {
            uploadUrl: '/summernote/upload',
            headers: {
                'X-CSRF-TOKEN': $("[name='csrf_field']").val()
            }
        },
        table: {
	        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        },
        language: lang,
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif',
                'Noto Sans KR, sans-serif',
                'Noto Serif KR, serif',
                'Nanum Gothic, sans-serif',
                'Nanum Myeongjo, serif',
                'Nanum Pen Script, cursive',
                'Nanum Brush Script, cursive',
                'Gothic A1, sans-serif',
                'Do Hyeon, sans-serif',
                'Jua, sans-serif',
                'Yeon Sung, cursive',
                'Black Han Sans, sans-serif',
                'Sunflower, sans-serif',
                'Dokdo, cursive',
                'Gaegu, cursive',
                'Hi Melody, cursive',
                'Gamja Flower, cursive',
                'Song Myung, serif',
                'Stylish, sans-serif',
                'Poor Story, cursive',
                'Cute Font, cursive',
                'East Sea Dokdo, cursive',
                'Roboto, sans-serif',
                'Lato, sans-serif',
                'Montserrat, sans-serif',
                'Oswald, sans-serif',
                'Raleway, sans-serif',
                'Sorkin Type, sans-serif',
                'Open Sans, sans-serif',
                'Source Sans Pro, sans-serif',
                'PT Sans, sans-serif',
                'Merriweather, serif',
                'Ubuntu, sans-serif',
                'Playfair, serif',
                'Nunito, sans-serif',
                'Mukta, sans-serif',
                'Lora, serif',
                'Dancing Script, cursive',
                'Abril Fatface, serif',
                'Caveat, cursive',
                'Kaushan Script, cursive',
                'Great Vibes, cursive',
                'Cookie, cursive'
            ],
            supportAllValues: true
        },
        fontSize: {
            options: [ 10, 12, 14, 'default', 18, 20, 22 ],
            supportAllValues: true
        },
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                },
                {
                    name: 'iframe',
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ],
            disallow:[
                {
                    name: 'script',
                }
            ]
        },
        htmlEmbed: {
            showPreviews: false,
        },
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
    } )
    .then( editor => {
        ckeditor_content = editor;
        $("#contents").html(ckeditor_content.getData());
    } );