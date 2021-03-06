

/**
 * Handler for web service's JSON protocol. Shows status messages and errors.
 * @param {jQuery} status_indicator Wrapped element to show status
 * @param {object}
 */
function GottaGo(status_indicator, query_object){
    if ("id" in query_object) {
        var using_gootago_key = true;
        var id = query_object['id'];
    } else {
        var using_gootago_key = false;
        var station = query_object['station'];
        var line = query_object['line'];
        var delay = query_object['delay'];
    }
    var error_messages = {
        no_api: Drupal.t("Statusinformation currently not available. Please try again later."),
        not_configured: Drupal.t("This key is not yet configured. Please go to gottago.ch and create a key."),
        no_data: Drupal.t("There are no data available for this key.")
    };

    var status_handlers = {
        go: function handle_go(json){
            status_indicator.text(Drupal.t("Go")).show();
        },
        no_go: function handle_no_go(json){
            status_indicator.text(Drupal.t("NoGo")).show();
        },
        off: function handle_off(json){
            if(!isNaN(json.status_changes.go)) {
                var minutesUntilGo = Math.round(json.status_changes.go/60);
                status_indicator.text(Drupal.t("@minutesUntilGo minutes", {"@minutesUntilGo": minutesUntilGo})).show();

                // Always show correct relative time
                if(minutesUntilGo>1){
                    var updatedStatusChanges = jQuery.extend({}, json.status_changes, {go:json.status_changes.go-60});
                    var updatedJson = jQuery.extend({}, json, {status_changes: updatedStatusChanges});
                    status_indicator.schedule(function(){
                        status_handlers.off(updatedJson);
                    }, 60*1000);
                }
            }
        }
    };

    /**
     * Restores the original state of the status indicator (neutral style, empty and hidden)
     * @return jQuery Wrapped status indicator element
     */
    status_indicator.reset = function(){
        return this.text('').removeClass('err off go no_go').hide();
    };

    if (using_gootago_key) {
        var url = '/gottago_status/' + encodeURIComponent(id);
    } else {
        var url = '/gottago_status_direct?station=' + encodeURIComponent(station) + '&line=' + encodeURIComponent(line) + '&delay=' + encodeURIComponent(delay);
    }

    status_indicator.query = function (){
        jQuery.ajax({
          url: url,
          dataType: 'json',
          success: function(data) {
            status_indicator.parseResponse(data)
          },
          error: function() {
            status_indicator.handleRequestError();
          }
        });
    };



    /**
     * Interprets the web service's response and displays status.
     */
    status_indicator.parseResponse = function parse(json){
        status_indicator.reset();
        status_indicator.clearAll();
        if(json.constructor!==({}).constructor){
            status_indicator.addClass('err').text(Drupal.t("Wrong data from the server.")).show();
            return;
        }

        if(json.error){
            status_indicator.addClass('err').text(error_messages[json.error] || Drupal.t("Unknown error")).show();
        } else {
            // Render current status
            jQuery('span.station_text').text(json.station);
            jQuery('span.line_text').text(json.line);
            if (json.description == "") {
                jQuery('div.description_wrapper').hide();
            } else {
                jQuery('span.description_text').text(json.description);
                jQuery('div.description_wrapper').show();
            }

            status_indicator.reset().addClass(json.status);
            status_handlers[json.status](json);

            jQuery.each(status_handlers, function(status, handler){
                var delay = json.status_changes[status];
                if(!isNaN(delay)){
                    // Schedule status changes for future states
                    status_indicator.schedule(function(){
                        status_indicator.reset().addClass(status);
                        handler(json);
                    }, delay*1000);
                }
            });
        }

        // Schedule another request to the server
        status_indicator.schedule(status_indicator.query, (json.next_refresh||60)*1000);
    };



    status_indicator.handleRequestError = function(){
        status_indicator.reset();
        status_indicator.addClass('err').text(Drupal.t("Server not reachable.")).show();

        status_indicator.clearAll();
        // Try again in 1min and hope service is up again
        status_indicator.schedule(status_indicator.query, 60*1000);
    };

    this.destroy = function() {
      status_indicator.clearAll();
      status_indicator.reset();
    }

    status_indicator.query();


        /**
         * List of pending or executed timeout handles
         * @type Array.<Integer>
         */
        var timeouts = [];

        /**
         * Aborts all running timeouts
         */
        status_indicator.clearAll = function(){
            jQuery.each(timeouts, function(index, timeout){
                // Abort timeout
                clearTimeout(timeout);
            });
            timeouts = [];
        };

        /**
         * Schedules a function for later execution and keeps a handle for abortion.
         * @param {Function} callback Delayed function
         * @param {Number} milliseconds Amount of time to delay execution
         */
        status_indicator.schedule = function(callback, milliseconds){
            timeouts.push(setTimeout(callback, milliseconds));
        };
}
