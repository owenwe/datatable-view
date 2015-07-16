var primaryKeyColumnModifyRender = function(data, type, full, meta) {
    return [
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-info btn-xs dtview-edit-btn" data-row-id="',data,'">',
                '<span class="glyphicon glyphicon-cog"></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-danger btn-xs dtview-del-btn">',
                '<span class="glyphicon glyphicon-remove"></span>',
            '</button>',
        '</div>'
    ].join('');
};
    
    