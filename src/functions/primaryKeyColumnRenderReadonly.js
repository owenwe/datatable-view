var primaryKeyColumnReadonlyRender = function(data, type, full, meta) {
    return [
        '<div class="center-block text-center">',
            '<a class="dtview-edit-btn" data-row-id="',data,'" data-view-only="true">View</a>',
        '</div>'
    ].join('');
};

