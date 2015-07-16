var getFormData = function() {
    var returnData = {},
    idValue = $('#'+this.sourceData.primaryKey,this.modalForm).val(),
    editMode = _.isFinite(idValue),
    requiredInputs = _.where(this.formInputs, {'required':true}),
    optionalInputs = _.where(this.formInputs, {'required':false, 'disabled':false}),
    validInputsTotal = requiredInputs.length,
    validInputCount = 0;
    
    if(editMode) {
        returnData[this.sourceData.primaryKey] = idValue*1;
    }
    
    // required inputs
    for(var i in requiredInputs) {
        if(requiredInputs[i].type==='custom') {
            // should add input properties and values to form data object
            // the .get() function will trigger validation display
            var custData = requiredInputs[i].input.formInput.get(),
                custValidInptCount = 0,
                custInptCount = custData.length;
            for(var cidx in custData) {
                for(var cKey in custData[cidx]) {
                    if(custData[cidx][cKey]!==false) {
                        custValidInptCount++;
                        returnData[cKey] = custData[cidx][cKey];
                    }
                }
            }
            if(custValidInptCount===custInptCount) {
                validInputCount++;
            }
            
        } else {
            var inputValue = this.getFormInputValue(requiredInputs[i]);
            if(inputValue!==false) {
                validInputCount++;
                returnData[requiredInputs[i].name] = inputValue;
            }
            this.displayInputValidation(requiredInputs[i], inputValue!==false);
        }
    }
    
    //optional inputs
    for(var j in optionalInputs) {
        if(optionalInputs[j].type==='custom') {
            var custData = optionalInputs[j].input.formInput.get();
            for(var cidx in custData) {
                if(custData[cidx]!==false) {
                    returnData[cidx] = custData[cidx];
                }
            }
            
        } else {
            var inputValue = this.getFormInputValue(optionalInputs[j]);
            if(inputValue!==false) {
                returnData[optionalInputs[j].name] = inputValue;
            }
        }
    }
    
    return (validInputCount===validInputsTotal) ? returnData : false;
};