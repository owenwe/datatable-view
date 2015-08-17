/**
 * A render function for a primary key column in a datatable. This function 
 * would render a link labeled, "View".
 * @callback primaryKeyColumnReadonlyRender
 * @param {object} data - the data from the datatable row
 * @param {string} type - the data type for the column rendered
 * @param {object} full - all data from datatables
 * @param {object} meta - additional information about the column
 */
var primaryKeyColumnReadonlyRender = function(data, type, full, meta) {
    return [
        '<div class="center-block text-center">',
            '<a class="dtview-edit-btn" data-row-id="',data,'" data-view-only="true">View</a>',
        '</div>'
    ].join('');
};

