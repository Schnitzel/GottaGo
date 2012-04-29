(function ($){
  var gottaGo;
  
  Drupal.behaviors.initGottago = {
    attach: function(context) {
      updateDirectGottaGo();
      $('input[name="field_line[und]"]', context).not('.gottago-processed').addClass('gottago-processed').bind('click', function(event) {
        updateDirectGottaGo();
        scrollToDelay();
      });
      $('input[name="field_delay[und][0][value]"]', context).not('.gottago-processed').addClass('gottago-processed').bind('change', function(event) {
        updateDirectGottaGo();
      });
    }
  }

  function updateDirectGottaGo() {
    // Get the latest selected values for the form.
    var delay = $('input[name="field_delay[und][0][value]"]').val();
    var station = $('input[name="field_station[und][0][value]"]').val();
    var line = $('input[name="field_line[und]"]:checked').val();
    // Update only if we have all the values.
    if (delay && station && line) {
      // If we have already an object, destroy it first and create a new one.
      // @todo: This should be improved... maybe provide some reset function or
      // a way to just update the station, line and delay.
      if (gottaGo) {
        gottaGo.destroy();
      }
      gottaGo = new GottaGo($('#gottago_status_indicator'), { station: station, line: line, delay: delay});
    }
  }
  
  function scrollToDelay() {
    var target_offset = $('input[name="field_delay[und][0][value]"]').offset();
    if (target_offset) {
      var target_top = target_offset.top - 200;
      $('html body').animate({scrollTop:target_top}, 1200);
    }
  }

})(jQuery);
