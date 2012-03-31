(function($){
  Drupal.behaviors.initGottaGo = {
    attach: function() {
      //alert(Drupal.settings.gottago.id);
      var gottaGo = new GottaGo($('#status_indicator'), function requery(){
        queryService(Drupal.settings.gottago.id);
      });
      
      queryService(Drupal.settings.gottago.id);
      
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
  }
})(jQuery);