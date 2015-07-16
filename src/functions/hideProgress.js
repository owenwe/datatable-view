var hideProgress = function() {
    // enable modal buttons
    $('div.modal-header button.close',this.modalForm).show();
    $('div.modal-footer button',this.modalForm).each(function(i, e) {
        e.disabled = false;
    });
    
    // reset progress bar
    this.resetProgressBar();
    
    // hide progress bar
    this.actionProgressPanel.hide();
    $('div.progress-bar',this.modalForm).removeClass('progress-bar-danger');
    
    // show input form
    $('form',this.modalForm).show();
};