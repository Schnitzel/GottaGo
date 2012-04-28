(function($){
  Drupal.behaviors.initGottaGo = {
    attach: function() {
      $('.status_indicator').each(function(){
        var id = $(this).attr("rel");
        var gottaGo = new GottaGo($(this), { id: id });
      });
    }
  }
})(jQuery);