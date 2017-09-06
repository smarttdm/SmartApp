(function(){
  CKEDITOR.plugins.add('openfile', {
      lang: 'en,ru,fr,nl,zh-cn',
      requires: 'widget,dialog',
      icons: 'openfile',
      init: function(editor) {
       var lang = editor.lang.openfile;

       editor.addCommand('openfile', new CKEDITOR.dialogCommand('openfile'));

       CKEDITOR.dialog.add('openfile',  this.path + 'dialogs/openfile.js');

       // Add widget
       editor.ui.addButton('openfile', {
          label: lang.openFormFile,
         command: 'openfile',
         icon: this.path + 'icons/openfile.png',
         toolbar: "document,5"
       });
      }
    }
  );

})();
