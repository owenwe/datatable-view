var displayInputValidation = function(finput, isValid) {
    finput.input.formGroup.toggleClass('has-success',isValid).toggleClass('has-error', !isValid);
    // some input controls won't have the feedback visual element
    if($('span.glyphicon.form-control-feedback',finput.input.formGroup).length) {
        $('span.glyphicon.form-control-feedback',finput.input.formGroup)
            .removeClass('hidden')
            .toggleClass('glyphicon-ok',isValid)
            .toggleClass('glyphicon-remove',!isValid);
    }
};