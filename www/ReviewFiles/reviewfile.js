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
    var reviewName = getUrlVars()['reviewName'];
    console.log(fileName)
    $('#pageTitle').html(fileName);

    $.get('/retrievediff/'+reviewName+'/'+fileName, function(data) {
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

        var commentVue = new Vue({
            el: '#commentVue',
            data: {
                comments: [1,1,1,1,1,1,1,1,1],
                toggleTitle: 'Review Comments'
            },
            computed: {
                numOfComments: function() {return this.comments.length + ' comments'}
            }
        });

        var createCommentVue = new Vue({
            el: '#createCommentVue'
        });
    }).fail(function(err) {
        if (err.status == 401)
          window.location = "/Verification/login.html"
      });
});