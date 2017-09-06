CKEDITOR.dialog.add('openfile', function (editor) {
    var lang = editor.lang.openfile;
  return {
      title: lang.openFormFile,
      minWidth: 600,
      minHeight: 400,
      onOk: function() {
          // "this" is now a CKEDITOR.dialog object.
          var document = this.getElement().getDocument();
          // document = CKEDITOR.dom.document
         
          var scope = angular.element($("#openFileCtrl")).scope();
          
          if (scope.nodeType === "Folder") {
              alert(lang.notClassNode);
              return false;
          }
          else {
                editor.scope.loadForm();
          }
      },
      contents: [
          {
              id: 'tab1',
              label: '',
              accessKey: 'O',
              title: '',
              elements: [
                  {
                      type: 'html',
                      html: "<div ng-include=\"'/app/formeditor/views/open-file.html'\"></div>",
                      onShow:function(event)
                      {
                      },
                      onLoad: function (event) {
                          editor.compile(event.sender.parts.dialog.$)(editor.scope);
                      }
                  }
              ]
          }
      ]

  };
});
