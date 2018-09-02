function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    console.log(vars)
    return vars;
}

$(document).ready(function() {
    var fileName = getUrlVars()['fileName'];
    console.log(fileName)
    $('#pageTitle').html(fileName);

    $.get('/retrievediff/asdf', function(data) {
        var diffContent = new Vue({
            el: '#diffContent',
            computed: {
                dynamicComponent: function() {
                    return {
                        template: '<div>'+data+'</div>'
                    }
                }
            }
        });
    });
});