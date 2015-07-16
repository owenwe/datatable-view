// modify the progress bar label
var setProgressBarLabel = function(label) {
    $('div.progress-bar.progress-bar-striped span', this.progressBar).empty().html(label);
};