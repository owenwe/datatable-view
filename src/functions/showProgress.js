// showProgress and hideProgress are for saving, the progress bar is
// in a panel header inside the add/edit modal form
var showProgress = function() {
    // disable modal buttons
    $('div.modal-header button.close',this.modalForm).hide();
    $('div.modal-footer button',this.modalForm).each(function(i, e) {
        e.disabled = true;
    });
    
    // hide (with transition) input form
    $('form', this.modalForm).hide();
    
    // show (with transition) progress bar
    this.actionProgressPanel.show();
};