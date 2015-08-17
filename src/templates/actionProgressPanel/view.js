/**
 * Template for rendering the Action Progress Panel.
 * @memberof $.fn.DataTableView
 * @constant {string} template_app_view
 * @property {object} config - the template variable
 * @property {string} config.label - the label inside the progress bar
 * @property {string} config.errorMessage - the error message
 * @property {number} config.defaultValue - current value of the progress bar
 * @property {number} config.max - maximum value of the progress bar
 * @property {number} config.min - minimum value of the progress bar
 */
var template_app_view = [
'<div class="panel-heading">',
    '<div class="progress">',
        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="<%= config.defaultValue %>" aria-valuemin="<%= config.min %>" aria-valuemax="<%= config.max %>" style="width:100%">',
            '<span><%= config.label %></span>',
        '</div>',
    '</div>',
'</div>',
'<div class="panel-body text-danger"><%= config.errorMessage %></div>'
].join('');

