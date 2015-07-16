var resetForm = function() {
    //reset primary key hidden input
    $('#'+this.sourceData.primaryKey,this.modalForm).val(null);
    
    //loop through all inputs
    for(var i in this.formInputs) {
        var inpt = this.formInputs[i];
        if(inpt.type==='text' || inpt.type==='textarea') {
            inpt.input.formInput.val(null);
        } else if(inpt.type==='boolean') {
            // put the default value radio button first in your form group
            inpt.input.formInput.first().addClass('active');
            inpt.input.formInput.last().removeClass('active');
        } else if(inpt.type==='spinbox') {
            inpt.input.formInput.spinbox('value',0);
        } else if(inpt.type==='datepicker') {
            inpt.input.formInput.datepicker('setDate',null);
        } else if(inpt.type==='timestamp') {
            inpt.input.formInput.val(null);
        } else if(inpt.type==='radioset') {
            inpt.input.formInput.removeClass('active');
            inpt.input.formInput.first().addClass('active');
        } else if(inpt.type==='dropdown') {
            $('input:hidden',inpt.input.formGroup).val(null);
            $('input:text',inpt.input.formGroup).val(null);
        } else if(inpt.type==='typeahead') {
            $('input:text',inpt.input.formGroup).typeahead('val',null);
            inpt.value = null;
        } else if(inpt.type==='custom') {
            inpt.input.formInput.reset();
        }
        
        if(inpt.required) {
            inpt.input.formGroup.removeClass('has-success has-error');
            $('span.glyphicon.form-control-feedback',inpt.input.formGroup).removeClass('glyphicon-ok glyphicon-remove').addClass('hidden');
        }
    }
};