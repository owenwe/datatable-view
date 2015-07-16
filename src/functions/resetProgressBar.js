// restore progress bar to original state
var resetProgressBar = function() {
    this.setProgressBarLabel('saving');
    $('div.action-progress-panel div.panel', this.modalForm).removeClass('panel-danger');
    $('div.action-progress-panel .progress-bar', this.modalForm).removeClass('progress-bar-danger');
    $('div.edit-dtview-modal div.action-progress-panel div.panel-body').empty();
};