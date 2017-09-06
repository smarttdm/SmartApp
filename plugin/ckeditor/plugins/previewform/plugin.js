(function(){
  CKEDITOR.plugins.add('previewform', {
      lang: 'en,ru,fr,nl,zh-cn',
      requires: 'widget,dialog',
      icons: 'previewform',
      init: function(editor) {
       var lang = editor.lang.previewform;

       editor.addCommand('previewform', {
           exec: function (editor) {
               editor.scope.previewForm();
           }
       });

       // Add widget
       editor.ui.addButton('previewform', {
          label: lang.previewForm,
         command: 'previewform',
         icon: this.path + 'icons/previewform.png',
         toolbar: "document,6"
       });
      }
    }
  );

})();
