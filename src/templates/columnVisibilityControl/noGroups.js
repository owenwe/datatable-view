/**
 * The template string for the Column Visibility Group without groups
 * @memberof $.fn.DataTableView
 * @constant {string} template_cvc_noGroups
 */
var template_cvc_noGroups = [
     '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
         '<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="caret"></span>',
     '</button>',
     '<ul class="dropdown-menu list-unstyled text-nowrap col-vis-menu" role="menu">',
         '<li<% if(_.has(config,"widthOverride")) { %> style="width:<%= config.widthOverride %>px" <% } %>>',
             '<h3><u>Column Visibility</u></h3>',
             '<ul class="list-inline list-unstyled">',
             '<% for(var i in config.sorted) { %>',
                 '<li>',
                     '<div class="checkbox">',
                         '<label class="text-nowrap btn btn-sm btn-default">',
                             '<input type="checkbox" data-column="<%= config.sorted[i].data %>" ',
                                 'value="<%= config.sorted[i].index %>"<% if(config.sorted[i].visible) { %> checked="checked"<% } %> />',
                             '<span class="text-capitalize"><%= config.sorted[i].title %></span>',
                         '</label>',
                     '</div>',
                 '</li>',
             '<% } %>',
             '</ul>',
             '<p><button type="button" class="btn btn-default" data-group-index="-1">reset</button></p>',
         '</li>',
     '</ul>'
 ].join('');