/**
 * A render function for a primary key column in a datatable. This function 
 * would render modify and delete buttons.
 * @callback primaryKeyColumnModifyRender
 * @param {object} data - the data from the datatable row
 * @param {string} type - the data type for the column rendered
 * @param {object} full - all data from datatables
 * @param {object} meta - additional information about the column
 */
var primaryKeyColumnModifyRender = function(data, type, full, meta) {
    return [
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-info btn-xs dtview-edit-btn" data-row-id="',data,'" data-view-only="false">',
                '<span class="glyphicon glyphicon-cog"></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-danger btn-xs dtview-del-btn">',
                '<span class="glyphicon glyphicon-remove"></span>',
            '</button>',
        '</div>'
    ].join('');
};
    
    