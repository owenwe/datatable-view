// populates the form inputs with data grabbed from the data table
    // dtData: data from the data table row
var setFormData = function(dtData) {
    for(var i in this.formInputs) {
        var inpt = this.formInputs[i];
        if(inpt.type==='text' || inpt.type==='textarea') {
            inpt.input.formInput.val(dtData[inpt.name]);
        } else if(inpt.type==='boolean') {
            inpt.input.formInput.removeClass('active'); 
            inpt.input.formInput.each(function(idx,eLabel) {
                var lbl = $(eLabel),
                    isMatch = ($('input:radio',lbl).val()*1)==dtData[inpt.name];
                if(isMatch) {
                    lbl.addClass('active');
                }
            });
        } else if(inpt.type==='spinbox' && _.isFinite(dtData[inpt.name])) {
            inpt.input.formInput.spinbox('value',dtData[inpt.name]);
        } else if(inpt.type==='datepicker' && _.isFinite(dtData[inpt.name])) {
            inpt.input.formInput.datepicker('setDate', new Date(dtData[inpt.name]));
        } else if(inpt.type==='timestamp' && _.isFinite(dtData[inpt.name])) {
            inpt.input.formInput.val( moment(dtData[inpt.name]).format("M/D/YYYY h:mm:ss a") );
        } else if(inpt.type==='radioset') {
            $('label.btn', inpt.input.formGroup).removeClass('active');
            $(['label.btn[data-',inpt.valueKey,'="',dtData[inpt.name][inpt.valueKey],'"]'].join(''), inpt.input.formGroup).addClass('active');
        } else if(inpt.type==='dropdown') {
            try {
                $('input:hidden',inpt.input.formGroup).val(dtData[inpt.name][inpt.valueKey]);
                if(typeof(inpt.displayKey)==='string') {
                    $('input:text',inpt.input.formGroup).val(dtData[inpt.name][inpt.displayKey]);
                } else {
                    $('input:text',inpt.input.formGroup).val(inpt.displayKey(dtData[inpt.name]));
                }
            } catch(err) {
                console.log(err);
            }
        } else if(inpt.type==='typeahead') {
            inpt.value = dtData[inpt.name];
            if(typeof(inpt.displayKey)==='string') {
                $('input:text',inpt.input.formGroup).typeahead('val', dtData[inpt.name][inpt.displayKey]);
            } else {
                $('input:text',inpt.input.formGroup).typeahead('val', inpt.displayKey(inpt.value));
            }
        } else if(inpt.type==='custom') {
            inpt.input.formInput.set(dtData);
        }
    }
    
    // hidden input primary key
    $('#'+this.sourceData.primaryKey,this.modalForm).val(dtData[this.sourceData.primaryKey]);
};