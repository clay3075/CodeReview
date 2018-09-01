function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    console.log(vars)
    return vars;
}

$( document ).ready(function() {
    var reviewName = getUrlVars()['reviewName'];
    document.title += ' - ' + reviewName;
    $.get('/reviewfiles/' + reviewName, function(data) {
        var files = JSON.parse(data);
        var reviewfiles = new Vue({
            el: '#reviewfiles',
            data: {
                reviewName: reviewName,
                files: files
            }
        });
    });

    var modalVue = new Vue({
        el: '#modalVue',
        data: {
            reviewName: reviewName,
            reviewFile: ''
        },
        methods: {
            onChange: function() {
                reviewFile = $('#reviewFileInput').val();
                console.log(reviewFile);
            }
        }
    });
});