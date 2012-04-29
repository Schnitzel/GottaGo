(function ($){
  var gottaGo;
  
  Drupal.behaviors.initGottago = {
    attach: function(context) {
      $('input[name="field_line[und]"]', context).not('.gottago-processed').addClass('gottago-processed').bind('click', function(event) {
        updateDirectGottaGo();
      });
      $('input[name="field_delay[und][0][value]"]', context).not('.gottago-processed').addClass('gottago-processed').bind('change', function(event) {
        updateDirectGottaGo();
      });
      $('#edit-submit', context).bind('click', function(event) {
        // If there is no description, show the description field.
        // @todo: also show the login/register.
        if ($('input[name="field_description[und][0][value]"]').parent().is(':hidden')) {
          $('input[name="field_description[und][0][value]"]').parent().slideDown();
          $('#edit-register').slideDown();
          $('#edit-login').slideDown();
          return false;
        }
      });
      if ($('input[name="field_description[und][0][value]"]', context).val() == '') {
        $('input[name="field_description[und][0][value]"]', context).parent().hide();
        $('#edit-register', context).hide();
        $('#edit-login', context).hide();
        $('#edit-actions', context).hide();
      }
      scrollToDelay();
      updateDirectGottaGo();
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
      // If the user is logged in (if the user-login fieldset is not in the
      // page), then show the description field.
      if (!$('#edit-login').get(0)) {
        $('input[name="field_description[und][0][value]"]').parent().show();
      }
    }
  }
  
  function scrollToDelay() {
    var target_offset = $('input[name="field_delay[und][0][value]"]').offset();
    if (target_offset) {
      var target_top = target_offset.top - 100;
      $('html, body').animate({scrollTop:target_top}, 1200);
      // When we scroll to the delay, we can also show the buttons.
      $('#edit-actions').show();
    }
  }

})(jQuery);
