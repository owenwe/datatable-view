/**
 * Template string for the Modal Form Navigation control.
 * @memberof $.fn.DataTableView
 * @constant {string} template_mfv_view
 */
var template_mfv_view = [
    '<div class="modal-dialog modal-<%= config.modalSize %>">',
        '<div class="modal-content">',
            '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal">',
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
                '</button>',
                '<h4 class="modal-title"></h4>',
            '</div>',
            '<div class="modal-body">',
                '<div class="container-fluid dtview-form-container"></div>',
            '</div>',
            '<div class="modal-footer">',
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
                '<button type="button" class="btn btn-primary dtview-modal-form-action-button"></button>',
            '</div>',
        '</div>',
    '</div>'
].join('');

