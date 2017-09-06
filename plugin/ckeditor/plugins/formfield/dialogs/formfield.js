CKEDITOR.dialog.add('formfield', function (editor) {
    var lang = editor.lang.formfield;
  return {
      title: lang.insertFormField,
      minWidth: 600,
      minHeight: 400,
      onOk: function() {
          var scope = angular.element($("#insertPropertyCtrl")).scope();
          var fieldHtml = scope.getFieldElement();
          if (fieldHtml) {
              editor.insertHtml(fieldHtml);
          }
          else
          {
              alert(lang.noPropertySelected);
              return false;
          }
      },
      onShow: function() {
          var scope = angular.element($("#insertPropertyCtrl")).scope();
          if (scope)
          {
              scope.reInitialize();
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
                      html: "<div ng-include=\"'/app/formeditor/views/insert-property.html'\"></div>",
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
