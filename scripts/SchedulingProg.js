var SchedulingProg = SchedulingProg || {};

(function ($, window, document) {

    var toast_options = {
        stack: true,
        fullscreen: true,
        timeout: 3000,
        has_progress: true,
        rtl: true
    }

    SchedulingProg.call_toast = function (message, type) {
        $.Toast("", message, type, toast_options);
    }

    SchedulingProg.call_preloader = function (action) {
        // action is 'show' or 'hide'
        $('body').preloader(action);
    }

    SchedulingProg.call_modal = function (modal_options) {
        debugger;
        SchedulingProg.modal = $.Modal(modal_options);
        SchedulingProg.modal.showModal();
    }

    SchedulingProg.call_notifier = function (message, type, notifier_options) {
        $.Notifier("", message, type, notifier_options);
    }

    $(document).ready(SchedulingProg.ready);
})(jQuery, window, document)