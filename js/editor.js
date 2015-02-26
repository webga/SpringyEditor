/*!
* Springy Editor, the rich-text editor
* Version 1.0 (26-FEB-2015)
* @requires jQuery v1.2.3 or later
*
* Examples at: -- 
* Copyright (c) 2015 Gabriele Abatematteo
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

// TODO: internazionalization and language file for default messages
// TODO: _defaults loading text, loading image
// TODO: colorpicker must set text or background color
function Springy() {

    // default options
    var _defaults = {
        // the editor id
        id: 'cfeditor',

        // the field or input element id where to store the editor value
        // if you want set the start editor value (content) like when you're going to edit
        // an existing content, you can fill the fieldId value and when the editor is ready
        // set the content value, ready to be edited
        fieldId: 'cfeditor_temp',

        // the editor width
        width: '100%',

        // the editor height
        height: '300px',

        // indicate if the editor grow its heght based on the content. Default value is false
        autosize: false,

        // the current domain (format: http|http|other)
        domain: '', //'http://127.0.0.1:82/',

        // indicate if the editor font styles used in the page must be used in the editor
        usePageStyles: true,

        // connectors are used for the editor components such as image browser, add link and other
        connectors: SpringyConnectors,

        // the editor toolbar style. The default value is blue
        style: 'blue'
    };

    // custom options
    var _opts = null;
    
    // tollbar identifier
    var _toolbarId = null;

    // the content editable iframe
    var _iframe = null;

    // function: evaluate string or object funcions
    var _eval = function (obj) { var getType = {}; if (obj && getType.toString.call(obj) === '[object Function]') { obj(); } else if (obj != null) { if (obj.length > 0) { jQuery.globalEval(obj); } } };
    
    // function: extend an object with the second
    var _extend = function (obj, extObj) { if (obj) { for (var i in extObj) { if (obj[i] == undefined) { obj[i] = extObj[i]; } } } return obj; }
    
    // function: get the object length
    var _getObjectSize = function (obj) { var size = 0, key; for (key in obj) { if (obj.hasOwnProperty(key)) size++; } return size; };
    
    // function: clear the input from microsoft word html tags (see http://www.1stclassmedia.co.uk/developers/clean-ms-word-formatting.php)
    var _purgeMSWordTags = function (value) {
        value = value.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/gi, "");
        /*value = value.replace(/\<!(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/gi, "") ;*/
        /*//value = value.replace(/<!--(.*?)-->/, "");*/
        /*alternate//value = value.replace(/&lt;!--(.*?)--&gt;/g, "");*/
        value = value.replace(/<o:p>\s*<\/o:p>/g, ""); value = value.replace(/<o:p>.*?<\/o:p>/g, "&nbsp;"); value = value.replace(/\s*mso-[^:]+:[^;"]+;?/gi, "");
        value = value.replace(/\s*MARGIN: 0cm 0cm 0pt\s*;/gi, ""); value = value.replace(/\s*MARGIN: 0cm 0cm 0pt\s*"/gi, "\""); value = value.replace(/\s*TEXT-INDENT: 0cm\s*;/gi, "");
        value = value.replace(/\s*TEXT-INDENT: 0cm\s*"/gi, "\""); value = value.replace(/\s*TEXT-ALIGN: [^\s;]+;?"/gi, "\""); value = value.replace(/\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, "\"");
        value = value.replace(/\s*FONT-VARIANT: [^\s;]+;?"/gi, "\""); value = value.replace(/\s*tab-stops:[^;"]*;?/gi, ""); value = value.replace(/\s*tab-stops:[^"]*/gi, "");
        value = value.replace(/\s*face="[^"]*"/gi, ""); value = value.replace(/\s*face=[^ >]*/gi, ""); value = value.replace(/\s*FONT-FAMILY:[^;"]*;?/gi, "");
        value = value.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3"); value = value.replace(/<(\w[^>]*) style="([^\"]*)"([^>]*)/gi, "<$1$3"); value = value.replace(/\s*style="\s*"/gi, '');
        value = value.replace(/<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;'); value = value.replace(/<SPAN\s*[^>]*><\/SPAN>/gi, ''); value = value.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
        value = value.replace(/<SPAN\s*>(.*?)<\/SPAN>/gi, '$1'); value = value.replace(/<FONT\s*>(.*?)<\/FONT>/gi, '$1'); value = value.replace(/<\\?\?xml[^>]*>/gi, ""); value = value.replace(/<\/?\w+:[^>]*>/gi, "");
        
        /*value = value.replace( /<H\d>\s*<\/H\d>/gi, '');*/
        /*value = value.replace( /<H1([^>]*)>/gi, '');*/
        /*value = value.replace( /<H2([^>]*)>/gi, '');*/
        /*value = value.replace( /<H3([^>]*)>/gi, '');*/
        /*value = value.replace( /<H4([^>]*)>/gi, '');*/
        /*value = value.replace( /<H5([^>]*)>/gi, '');*/
        /*value = value.replace( /<H6([^>]*)>/gi, '');*/
        /*value = value.replace( /<\/H\d>/gi, '<br>'); 
        //remove this to take out breaks where Heading tags were*/
        /*value = value.replace( /<(U|I|STRIKE)>&nbsp;<\/\1>/g, '&nbsp;');*/
        /*value = value.replace( /<(B|b)>&nbsp;<\/\(b|B)>/g, '');*/

        value = value.replace(/<b>&nbsp;<\/b>/g, ''); value = value.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, ''); value = value.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, ''); value = value.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');
        //some RegEx code for the picky browsers
        var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)", "gi"); 
        value = value.replace(re, "<div$2</div>");
        var re2 = new RegExp("(<font|<FONT)([^*>]*>.*?)(<\/FONT>|<\/font>)", "gi");
        value = value.replace(re2, "<div$2</div>"); 
        value = value.replace(/size|SIZE = ([\d]{1})/g, '');
        return value;
    };

    // TODO: optimize this function, check if element exists, add the element to the current dialog and show the message
    // function: handle error messages
    var _hem = function (b, m) {
        if (b) {
            $(".modal-dialog > .content-navigator > .right-side > .tab > .rte_error").html(m).removeClass("hide");
            setTimeout(function () {
                _hem(false);
            }, 2500);
        }
        else {
            $(".modal-dialog > .content-navigator > .right-side > .tab > .rte_error").html("").addClass("hide");
        }
    }

    // function: make the editor grow its height based on the content
    var _editorFixSize = function (editor) {
        var innerDoc = (editor.get(0).contentDocument) ? editor.get(0).contentDocument : editor.get(0).contentWindow.document;
        if (innerDoc.body.scrollHeight != 0 && innerDoc.body.scrollHeight != undefined) {
            //editor.height(innerDoc.body.scrollHeight);
            editor.height(innerDoc.body.offsetHeight + 10);
        }
        return;
    };

    // function: execute a browser command for contenteditable elements
    // see https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand
    var _cmd = function (e, x, y) { e.contentDocument.execCommand(x, false, y); };
    
    // function: add html content to the editor using the execCommand, usually used by tools
    var _cmd_addcontent = function (e, html) {
        var doc = e.contentWindow.document;

        if (doc.selection && doc.selection.createRange) {
            /* IE */
            var range = doc.selection.createRange();
            if (range.htmlText === '') {
                doc.body.innerHTML = doc.body.innerHTML + html;
            }
            else {
                range.pasteHTML(html);
            }
        } else {
            /* FF */
            if (!doc.execCommand('insertHTML', false, html)) {
                doc.body.innerHTML = doc.body.innerHTML + html;
            }
        }
    };
    
    // function: ajax Synchronous call
    var _callSync = function (url, onDone) {
        $.ajax({
            async: false,
            url: url,
            beforeSend: function( xhr ) {
                xhr.overrideMimeType("text/html;");
            }
        }).done(function(data) {
            _eval(onDone(data));
        });
    };

    // function: open a modal dialog
    var _loadModal = function (settings) {
        /*
        settings:
            href            : the url to be loaded (must return html)
            callback        : after the dialog creation an ajax call will be performed. The callback will be executed on success
            title           : dialog title
            noTitleBar      : (true|false) if set to true the dialog title bar will be removed and the settings.title will be ignored. False is the default value
            customDialogId  : set the dialog identifier (id) suffix
            buttons         : dialog buttons, if not null
            REMOVED - mode
        */
        var dialogId = "rte_tool_dialog";

        if (settings.customDialogId) {
            dialogId = settings.customDialogId;
        }

        dialogId += _opts.id;

        // if the dialog already exists, will be removed before creation
        if ($("#" + dialogId).length > 0) {
            $("#" + dialogId).remove();
        }

        // check for empty title
        if (!settings.title) { 
            settings.title = "&nbsp;"; 
        }

        // add the dialog to the page
        $("body").append('<div id="' + dialogId + '" title="' + settings.title + '"></div>');

        // the callbackbuilder function will be executed if the ajax call (below in the code) run with success
        var callbackbuilder = function () {
            
            // prepare the dialog
            $("#" + dialogId).dialog({
                draggable: true, resizable: false, width: 'auto', height: 'auto', modal: true,
                position: { of: window, my: "center", at: "center", collision: "flip" },
                autoOpen: false,
                /*REM*///dialogClass: (settings.title) ? "" : 'no-title',
                close: function () { $(this).dialog('destroy').remove(); }
            });

            // check for titlebar removal
            if (settings.noTitleBar === true) {
                $(".ui-dialog-titlebar", $("#" + dialogId).parent()).attr("style", "-moz-user-select: none; background: none repeat scroll 0% 0% transparent; position: absolute; height: 80px; width: 80%; border: medium none;");
                $(".ui-dialog-titlebar-close", $("#" + dialogId).parent()).hide();
            }

            // if no sialog buttons are passed as parameters or the length is zero, the button bar will be removed
            if (settings.buttons == null || _getObjectSize(settings.buttons)) {
                $('.ui-dialog-buttonpane').remove();
            }
            else if (_getObjectSize(settings.buttons) > 0) {
                // buttons found in parameterrs, get the current button set
                var dialog_buttons = $("#" + dialogId).dialog("option", "buttons");
                
                // extend the current buttons or add new
                if (dialog_buttons.length > 0) {
                    $.extend(dialog_buttons, settings.buttons);
                }
                else {
                    dialog_buttons = settings.buttons;
                }

                // add buttons to the dialog
                $("#" + dialogId).dialog("option", "buttons", dialog_buttons); // setter
            }

            // open the dialog and set the position to center screen
            $("#" + dialogId).dialog('open');
            $("#" + dialogId).dialog("option", "position",
            {
                of: window,
                my: "center center",
                at: "center center",
                collision: "flip flip"
            });

            // evaluate callback function
            _eval(settings.callback($("#" + dialogId)));
        };

        $("#" + dialogId).load(settings.href, function (response, status, err) {
            switch (status) {
                case "error":
                    alert("Error while loading the module: " + err.status + " " + err.statusText, false);
                    break;
                case "success":
                    _eval(callbackbuilder);
                    break;
            };
            return false;
        });
    };
    
    // function: show the add link tool
    var _cmd_aad_link = function () {
        _loadModal({
            href: _opts.domain + _opts.connectors.link.url,
            noTitleBar: true,
            customDialogId: null,
            buttons: _opts.connectors.link.buttons,
            callback: function (dialog) {
                $("#rte_createlink").click(function () {
                    if ($("#rte_linkvalue").val() && $("#rte_linktext").val()) {
                        
                        var html = '&nbsp;<a href="' + $("#rte_linkvalue").val() + '"[target]>' + $("#rte_linktext").val() + '</a>&nbsp;';
                        html = html.replace("[target]", $("#rte_linktarget").val() ? 'target="' + $("#rte_linktarget").val() + '"' : '');
                        _cmd_addcontent($('#' + _opts.id).get(0), html);
                        
                        $(dialog).dialog('destroy').remove();
                    }
                    else {
                        _hem(true, "Completare tutti i campi per l'inserimento del link");
                    }
                });
                $("#rte_createlinkCancel").unbind("click").bind("click", function () {
                    $(dialog).dialog('destroy').remove();
                });
            }
        });
    };
    
    // function: show the add image tool
    var _cmd_aad_image = function () {
        _loadModal({
            href: _opts.domain + _opts.connectors.image.url,
            noTitleBar: true,
            customDialogId: null,
            buttons: _opts.connectors.image.buttons,
            callback: function (dialog) {
                $("#image_upload").attr("action", _opts.connectors.image.postUrl)
                $("#rte_createimage").unbind("click").bind("click", function () {
                    if ($("#rte_image").attr("src")) {
                        var imageAttributes = "";
                        /* SRC       */imageAttributes += ' src="' + $("#rte_image").attr("src") + '"';
                        /* STYLE     */if ($("#rte_image").attr("style") != "") { imageAttributes += ' style="' + $("#rte_image").attr("style") + '"'; }
                        /* ALIGNMENT */if ($("#rte_image").attr("align") != "") { imageAttributes += ' align="' + $("#rte_image").attr("align") + '"'; }

                        var html = '<img ' + imageAttributes + ' />';
                        _cmd_addcontent($('#' + _opts.id).get(0), html);
                        $(dialog).dialog('destroy').remove();
                    }
                    else {
                        _hem(true, "Completare tutti i campi per l'inserimento dell'immagine");
                    }
                });
                $("#rte_createimageCancel").unbind("click").bind("click", function () {
                    $(dialog).dialog('destroy').remove();
                });
            }
        });
    };

    // function: show the color picker tool
    var _cmd_color_picker = function () {
        _loadModal({
            href: _opts.domain + _opts.connectors.colorpicker.url,
            noTitleBar: true,
            customDialogId: null,
            buttons: _opts.connectors.colorpicker.buttons,
            callback: function (dialog) {

                $("#rte_colorpicker td").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        _cmd($('#' + _opts.id).get(0), 'forecolor', $(this).attr("bgcolor"));
                        $(dialog).dialog('destroy').remove();
                    });
                });
            }
        });
    };

    // function: create the editor instance and add it to the page
    this.Create = function (o) {
        _opts = _extend(o, _defaults);

        console.log(_opts);

        _toolbarId = _opts.id + "_toolbar";

        console.log(_toolbarId);

        // prepare the editor in page
        // wrap the editor
        $('#' + _opts.id).wrap('<div class="rte_editor"></div>');

        //set editor (and wrapper) size
        $('#' + _opts.id).css({
            width: _opts.width,
            height: _opts.height,
            border: "1px solid #dddddd"
        });
        // adjust parent container
        $('#' + _opts.id).parent(".rte_editor").css({
            width: "auto",
            height: "auto"
        });

        // and load the toolbar
        $('#' + _opts.id).before('<div id="' + _toolbarId + '"></div>');

        // toolbar size
        $('#' + _toolbarId).css({ width: $('#' + _opts.id).width() });
        // load buttons
        _callSync("../toolbar.htm", function (data) {
            $('#' + _toolbarId).html(data);
        });
        // toolbar style
        if (_opts.style.length > 0 && typeof (_opts.style) === "string") {
            $('#' + _toolbarId + " > .rte_toolbar").addClass(_opts.style);
        }
        
        // add content to the editor if exists any
        console.log("add content to the editor if exists any");
        console.log($('#' + _opts.fieldId));
        console.log($('#' + _opts.fieldId).val());
        _iframe = $('#' + _opts.id).contents().get(0);
        _iframe.open();
        _iframe.write($('#' + _opts.fieldId).val());
        _iframe.close();
        _iframe.designMode = 'on';

        // if editor auto size is enabled, attach the event on keyup to the iframe
        if (_opts.autosize) {
            _iframe.addEventListener('keyup', function () {
                _editorFixSize($('#' + _opts.id));
            }, true);
        }

        // toolbar bold
        console.log($("#" + _toolbarId + " .cmd.rte_bold"));
        $("#" + _toolbarId + " .cmd.rte_bold").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'bold');
                return false;
            });
        });
        // toolbar italic
        $("#" + _toolbarId + " .cmd.rte_italic").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'italic');
                return false;
            });
        });
        // toolbar underline
        $("#" + _toolbarId + " .cmd.rte_underline").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'underline');
                return false;
            });
        });
        // toolbar justify left
        $("#" + _toolbarId + " .cmd.rte_justifyleft").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'justifyleft');
                return false;
            });
        });
        // toolbar justify center
        $("#" + _toolbarId + " .cmd.rte_justifycenter").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'justifycenter');
                return false;
            });
        });
        // toolbar justify right
        $("#" + _toolbarId + " .cmd.rte_justifyright").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'justifyright');
                return false;
            });
        });
        // toolbar justify full
        $("#" + _toolbarId + " .cmd.rte_justifyfull").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'justifyfull');
                return false;
            });
        });

        // toolbar create link
        $("#" + _toolbarId + " .cmd.rte_toollink").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd_aad_link();
                return false;
            });
        });
        // toolbar remove link
        $("#" + _toolbarId + " .cmd.rte_toollink_remove").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'unlink');
                return false;
            });
        });
        // toolbar add image
        $("#" + _toolbarId + " .cmd.rte_toolimage").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd_aad_image();
                return false;
            });
        });
        // toolbar ordered list
        $("#" + _toolbarId + " .cmd.rte_insertorderedlist").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'insertorderedlist');
                return false;
            });
        });
        // toolbar bullets list
        $("#" + _opts.id + "_toolbar .cmd.rte_insertunorderedlist").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'insertunorderedlist');
                return false;
            });
        });
        // toolbar outdent
        $("#" + _opts.id + "_toolbar .cmd.rte_outdent").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'outdent');
                return false;
            });
        });
        // toolbar indent
        $("#" + _opts.id + "_toolbar .cmd.rte_indent").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'indent');
                return false;
            });
        });

        // toolbar font size
        $("#" + _opts.id + "_toolbar .cmd.rte_fontsize").each(function () {
            $(this).unbind("change").bind("change", function () {
                _cmd($('#' + _opts.id).get(0), 'FontSize', this[this.selectedIndex].value);
                return false;
            });
        });
        // toolbar font color
        $("#" + _opts.id + "_toolbar .cmd.rte_forecolor").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd_color_picker();
                return false;
            });
        });
        // toolbar undo
        $("#" + _opts.id + "_toolbar .cmd.rte_undo").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'undo');
                return false;
            });
        });
        // toolbar redo
        $("#" + _opts.id + "_toolbar .cmd.rte_redo").each(function () {
            $(this).unbind("click").bind("click", function () {
                _cmd($('#' + _opts.id).get(0), 'redo');
                return false;
            });
        });

        // toolbar copy (disabled)
        //_iframe.addEventListener('copy', function() { alert('copy done!') });

        // toolbar cut (disabled)
        //_iframe.addEventListener('cut', function() { alert('cut behaviour detected!') });

        // toolbar paste, handled by iframe with purge regexp
        jQuery(_iframe).bind('paste', function (e) {
            e.preventDefault();
            var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');

            _cmd_addcontent($('#' + _opts.id).get(0), _purgeMSWordTags(text));
            setTimeout(function () {
                if (_opts.autosize) {
                    _editorFixSize($('#' + _opts.id));
                }
            }, 150);
        });

        // add iframe Head informations for default styles
        $('head', $('#' + _opts.id).get(0).contentWindow.document).append('<link rel="stylesheet" href="/springy/css/editor-area.css" type="text/css">');

        // add iframe style informations
        if (_opts.usePageStyles) {
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("background-color", "#ffffff");
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("color", window.getComputedStyle(document.body).getPropertyValue('color'));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-family", window.getComputedStyle(document.body).getPropertyValue("font-family"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-size", window.getComputedStyle(document.body).getPropertyValue("font-size"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-size-adjust", window.getComputedStyle(document.body).getPropertyValue("font-size-adjust"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-stretch", window.getComputedStyle(document.body).getPropertyValue("font-stretch"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-style", window.getComputedStyle(document.body).getPropertyValue("font-style"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-variant", window.getComputedStyle(document.body).getPropertyValue("font-variant"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("font-weight", window.getComputedStyle(document.body).getPropertyValue("font-weight"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("justify-content", window.getComputedStyle(document.body).getPropertyValue("justify-content"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("letter-spacing", window.getComputedStyle(document.body).getPropertyValue("letter-spacing"));
            //$('body', $('#' + _opts.id).get(0).contentWindow.document).css("line-height", window.getComputedStyle(document.body).getPropertyValue("line-height"));
            $('body', $('#' + _opts.id).get(0).contentWindow.document).css("line-height", "auto");
        }

        // check if autosize is enabled and adjust the size/content first time, or add scrollbars to the iframe
        if (_opts.autosize) {
            $('#' + _opts.id).attr("scrolling", "no");
            setTimeout(function () {
                _editorFixSize($('#' + _opts.id));
            }, 150);
        }
        else {
            $('#' + _opts.id).attr("scrolling", "auto");
        }
    };

    // function: get the editor value
    this.value = function () {

        // get the content
        var val = $('#' + _opts.id).get(0).contentWindow.document.body.innerHTML;
        
        // remove all withespaces and br tags to check if the content is empty
        var test = val;
        test = test.replace(/\n/g, "");
        test = test.replace(/[\t ]+\</g, "<");
        test = test.replace(/\>[\t ]+\</g, "><");
        test = test.replace(/\>[\t ]+$/g, ">");
        test = test.replace(/\s+/g, "");
        test = test.replace(/(<br\ ?\/?>)+/g, "");
        
        // if the content length is zero, vall will be an empty string
        if (test.length == 0) {
            val = "";
        }

        temp = "";
        return val;
    };

}
