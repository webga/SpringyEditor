Springy Editor
==========

A WYSIWYG rich-content editor

How it works
==========
Add an iframe to your page and assign an id. In this example we'll use the id cfeditor 
```
<iframe src="" id="cfeditor"></iframe>
```

In your script (javascript) just use the following lines of code.
We'll use the hidden field id cfeditor_value 
```
var springyEditor = new Springy();
springyEditor.Create({ id: "cfeditor", fieldId: "cfeditor_value" }); 
```

Compatibility
==========
Run in all modern browsers that supports browser commands. 
see https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand#Commands

Demo
==========
open the file /docs/index.htm and foolow the instruction.

https://github.com/webga/SpringyEditor/blob/master/docs/index.htm

online demo will be available asap