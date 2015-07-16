var template_app_view = [
'<div class="panel-heading">',
    '<div class="progress">',
        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="<%= config.defaultValue %>" aria-valuemin="<%= config.min %>" aria-valuemax="<%= config.max %>" style="width:100%">',
            '<span><%= config.label %></span>',
        '</div>',
    '</div>',
'</div>',
'<div class="panel-body text-danger"><%= config.errorMessage %></div>'].join('');

