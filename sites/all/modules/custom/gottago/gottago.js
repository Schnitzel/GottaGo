(function ($){
  Drupal.behaviors.initGottago = {
    attach: function(context) {
      $('#gottago-line input[name="field_line[und]"]', context).bind('click', function(event) {
        alert($(this).val());
        updateGottaGo();
      });
    }
  }
  
  function updateGottaGo() {
    var gottaGo = new GottaGo($('#gottago_status_indicator'), function requery(){
      //queryService(Drupal.settings.gottago.id);
      queryService('T9S9');
      
    });
    queryService('T9S9');
    function queryService(id) {
      $.ajax({
        url: '/gottago_status/' + id,
        dataType: 'json',
        success: function(data) {
          gottaGo.parseResponse(data)
        },
        error: function() {
          gottaGo.handleRequestError();
        }
      });
    }
  }
  
})(jQuery);
