var getFormInputValue = function(fi) {
    var retVal = false;
    
    switch(fi.type) {
        case 'spinbox':
            retVal = fi.input.formInput.spinbox('value')*1;
            break;
        case 'boolean':
            var bVal = $('label.active input',fi.input.formGroup).val()*1;
            retVal = bVal ? 1 : 0;
            break;
        case 'datepicker':
            var idate = fi.input.formInput.datepicker('getDate');
            if(_.isDate(idate)) {
                retVal = !isNaN(idate.getTime()) ? idate.getTime() : false;
            }
            break;
        case 'timestamp':
            // this is here just so the default case won't try and grab the value
            break;
        case 'radioset':
            // will always have an active button
            var findObj = {},
                activeValue = $('label.active input', fi.input.formGroup).val();
            findObj[fi.valueKey] = typeof(fi.datasource[0][fi.valueKey])==='number' ? activeValue*1 : activeValue;
            retVal = _.findWhere(fi.datasource, findObj);
            break;
        case 'dropdown':
            var findObj = {},
                displayVal = $.trim($('input:text', fi.input.formGroup).val());
            if(displayVal.length) {
                var idValue = $('input:hidden', fi.input.formGroup).val();
                findObj[fi.valueKey] = typeof(fi.datasource[0][fi.valueKey])==='number' ? idValue*1 : idValue;
                retVal = _.findWhere(fi.datasource, findObj);
            }
            break;
        case 'typeahead':
            if(fi.value) {
                retVal = fi.value;
            }
            break;
        default:
            //assumes text or textarea input
            var txtVal = $.trim(fi.input.formInput.val());
            retVal = txtVal.length>0 ? txtVal : false;
            break;
    }
    return retVal;
};