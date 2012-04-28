(function ($){
  Drupal.behaviors.initGottago = {
    attach: function(context) {
      $('input[name="field_line[und]"]', context).bind('click', function(event) {
        updateDirectGottaGo();
      });
      $('input[name="field_delay[und][0][value]"]', context).bind('change', function(event) {
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
      var gottaGo = new GottaGo($('#gottago_status_indicator'), { station: station, line: line, delay: delay});
    }
  }
  
})(jQuery);
