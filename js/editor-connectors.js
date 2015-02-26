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

// this is the connectors object used for the editor components such as image browser, add link  and color picker
// each connector (object) have it's parameters: 
//      url         : the resource url where to get the html content for the tool
//      buttons     : the modal dialog buttons (jquery). NOTE: set it to null if no buttons are required to override the base 
//      postUrl     : this is used from form actions inside the tool (i.e.: image upload)
// the connector items have the following configuration:
//      object: {
//          url: "http://somewhere.go",
//          postUrl: "action.ext"
//          buttons: {
//              "Ok": function () {
//                  ..code here...
//              }
//              "Cancel": function () {
//                  ..code here...
//              }
//          }
//      }
var SpringyConnectors = {
    // color picker tool
    colorpicker: {
        url: "/springy/tool/colorpicker.htm",
        buttons: {
            "Cancel": function () {
                $(this).dialog('destroy').remove();
            }
        }
    },
    // image uploader tool (must be implemented)
    image: {
        url: "/springy/tool/image.htm",
        postUrl: "",
        buttons: {
            "Ok": function () { },
            "Cancel": function () {
                $(this).dialog('destroy').remove();
            }
        }
    },
    // add link tool
    link: {
        url: "/springy/tool/link.htm",
        buttons: {
            "Ok": function () {
                $("#rte_createlink").click();
            },
            "Cancel": function () {
                $("#rte_createlinkCancel").click();
                $(this).dialog('destroy').remove();
            }
        }
    }
};