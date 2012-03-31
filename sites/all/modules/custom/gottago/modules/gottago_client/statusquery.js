/**
 * Scheduler that allows abortion of scheduled tasks
 */
function Scheduler(){
    /**
     * List of pending or executed timeout handles
     * @type Array.<Integer>
     */
    var timeouts = [];

    /**
     * Aborts all running timeouts
     */
    this.clearAll = function(){
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
    this.schedule = function(callback, milliseconds){
        timeouts.push(setTimeout(callback, milliseconds));
    };
}

/**
 * Handler for web service's JSON protocol. Shows status messages and errors.
 * @param {jQuery} status_indicator Wrapped element to show status
 * @param {Function} query_service Callback to query web service again
 */
function GottaGo(status_indicator, query_service){
    var timeouts = new Scheduler();
    var error_messages = {
        no_api: "Statusinformationen sind derzeit nicht verfügbar. Bitte zu einem späteren Zeitpunkt erneut versuchen.",
        not_configured: "Der eingegebene Schlüssel wurde noch nicht konfiguriert. Bitte auf der Website einloggen und Schlüssel konfigurieren.",
        no_data: "Es sind keine Daten für den angegebenen Schlüssel verfügbar."
    };
    var status_handlers = {
        go: function handle_go(json){
            status_indicator.text("Jetzt gehen.").show();
        },
        no_go: function handle_no_go(json){
            status_indicator.text("Zu spät.").show();
        },
        off: function handle_off(json){
            if(!isNaN(json.status_changes.go)) {
                var minutesUntilGo = Math.round(json.status_changes.go/60);
                status_indicator.text(" Noch "+minutesUntilGo+" Minuten.").show();
            }
        }
    };

    /**
     * Restores the original state of the status indicator (neutral style, empty and hidden)
     * @return jQuery Wrapped status indicator element
     */
    status_indicator.reset = function(){
        return this.text('').removeClass().hide();
    };

    /**
     * Interprets the web service's response and displays status.
     */
    this.parseResponse = function parse(json){
        status_indicator.reset();
        timeouts.clearAll();
        if(json.constructor!==({}).constructor){
            status_indicator.addClass('error').text("Falsche Daten vom Server erhalten.").show();
            return;
        }

        if(json.error){
            status_indicator.addClass('error').text(error_messages[json.error] || "Unbekannter Fehler").show();
        } else {
            // Render current status
            status_indicator.reset().addClass(json.status);
            status_handlers[json.status](json);

            jQuery.each(status_handlers, function(status, handler){
                var delay = json.status_changes[status];
                if(!isNaN(delay)){
                    // Schedule status changes for future states
                    timeouts.schedule(function(){
                        status_indicator.reset().addClass(status);
                        handler(json);
                    }, delay*1000);
                }
            });
        }

        // Schedule another request to the server
        timeouts.schedule(query_service, (json.next_refresh||60)*1000);
    };

    this.handleRequestError = function(){
        status_indicator.reset();
        status_indicator.addClass('error').text("Server nicht erreichbar.").show();

        timeouts.clearAll();
        // Try again in 1min and hope service is up again
        timeouts.schedule(query_service, 60*1000);
    };
}