(function(){
  CKEDITOR.plugins.add('formfield', {
      lang: 'en,ru,fr,nl,zh-cn',
      requires: 'widget,dialog',
      icons: 'formfield',
      init: function(editor) {
       var lang = editor.lang.formfield;

       editor.addCommand('formfield', new CKEDITOR.dialogCommand('formfield'));

       CKEDITOR.dialog.add('formfield',  this.path + 'dialogs/formfield.js');

       // Add widget
       editor.ui.addButton('formfield', {
           label: lang.insertFormField,
         command: 'formfield',
         icon: this.path + 'icons/formfield.png',
         toolbar: "insert,2"
       });
      }
    }
  );

})();
