// change progress bar style and display error message
var progressErrorMessage = function(message) {
    this.setProgressBarLabel('error');
    // change the panel coloring to red
    $('div.action-progress-panel div.panel',this.modalForm).addClass('panel-danger');
    $('div.action-progress-panel .progress-bar',this.modalForm).addClass('progress-bar-danger');
    // display error message in modal progress panel body 
    $('div.action-progress-panel div.panel-body',this.modalForm).empty().append([
        '<p>',message,'</p>',
        '<div class="pull-right clearfix">',
            '<button type="button" class="btn btn-danger">OK</button>',
        '</div>'
    ].join(''));
};