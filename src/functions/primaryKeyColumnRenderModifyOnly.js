/**
 * A render function for a primary key column in a datatable. This function 
 * would only render a modify button.
 * @callback primaryKeyColumnModifyOnlyRender
 * @param {object} data - the data from the datatable row
 * @param {string} type - the data type for the column rendered
 * @param {object} full - all data from datatables
 * @param {object} meta - additional information about the column
 */
var primaryKeyColumnModifyOnlyRender = function(data, type, full, meta) {
    return [
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-info btn-xs dtview-edit-btn" data-row-id="',data,'" data-view-only="false">',
                '<span class="glyphicon glyphicon-cog"></span>',
            '</button>',
        '</div>'
    ].join('');
};
    
    