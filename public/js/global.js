/**
 * Contains Javascript code that should be executed when the document is ready.
 */
$(document).ready(function() {
    // Initialize Material Design
    $('body').bootstrapMaterialDesign();

    // Make the call to delete the record, close the modal and remove the card from the page
    $('#confirmDelete').on('click', '.btn-danger', function(e) {
        var recordId = $(this).data('recordId');
        var targetRoute = $(this).data('targetRoute');
        $.delete(
            targetRoute,
            null,
            function() {
                $('#confirmDelete').modal('hide');
                $('#card_'+recordId).remove();
            },
            'json'
        );
    });

    //Set the correct targetUrl in the modal
    $('#confirmDelete').on('show.bs.modal', function(e) {
        var data = $(e.relatedTarget).data();

        $('.btn-danger', this).data('recordId', data.recordId);
        $('.btn-danger', this).data('targetRoute', data.targetRoute);
    });

    /**
     * #confirm is a modal used for all action that need a confirmation.
     * Any confirm needs a title, message, confirm name (action) and route.
     */
    $('#confirm')
        .on('show.bs.modal', function(e) {
            var data = $(e.relatedTarget).data();
            $(this).find('.modal-title').text(data.title);
            $(this).find('.modal-body').text(data.message);
            $(this).find('.btnConfirm').text(data.confirm);
            $(this).find('.btnConfirm').addClass(data.confirmClass);

            $('.btnConfirm', this).data('route', data.route);
            $('.btnConfirm', this).data('callback', data.callback);
        })

        // When the model is hidden we need to reset it for a next use.
        .on('hidden.bs.modal', function () {
            $(this).closeConfirm();
        })

        .on('click', '.btnConfirm', function () {
            var confirmReq = $.ajax({
                url: $(this).data('route'),
                type: 'GET',
                data: null,
                dataType: 'json'
            });

            confirmReq.done( function (response) {
                $(this).closeConfirm();

                var cbFunction = $('#confirm').find('.btnConfirm').data('callback');
                if (typeof $(this)[cbFunction] === 'function') {
                    $(this)[cbFunction](response);
                }
                $(this).notify(response.message);
            });

            confirmReq.fail( function ( response ) {
                console.log(response);
                var errors = response.responseJSON;
                var errorsHtml= '';
                $.each( errors, function( key, value ) {
                    errorsHtml += '<li>' + value[0] + '</li>';
                });
                $(this).snackbar('<ul>'+errorsHtml+'</ul>')
            })
        });

});

$.fn.closeConfirm = function (){
    var confirm = $('#confirm');
    confirm.find('.modal-title').text('_title_');
    confirm.find('.modal-body').text('_message_');
    confirm.find('.btnConfirm').text('_confirm_');
    confirm.find('.btnConfirm').prop('class', 'btn btn-default btnConfirm');
}

/**
 * Helper function to completely reset a form.
 */
$.fn.resetForm = function(id) {
    var form = $('#'+id).find('form')[0];
    form.reset();
    form.action = null;
    form.method = null;
    $('#'+id).find('#id').val(null);
    return this;
};

$.fn.notify = function(message) {
    $.snackbar({
        content: '<div><i class="material-icons">settings_applications</i>&nbsp;'+message+'</div>',
        htmlAllowed: true
    });
    return this;
}

// Prepare any Ajax requests we want to make
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

// Create jQuery DELETE/PUT function
jQuery.each( [ "put", "delete" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});
