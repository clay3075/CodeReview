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

        $.get('/comments/'+reviewName+'/'+fileName, function(commentInfo) {
            console.log(commentInfo);
            var commentVue = new Vue({
                el: '#commentVue',
                data: {
                    comments: JSON.parse(commentInfo),
                    toggleTitle: 'Review Comments'
                },
                computed: {
                    numOfComments: function() {return this.comments.length + ' comments'}
                },
                methods: {
                    TimeSinceCreated: function(DateCreated) {
                        console.log(typeof(DateCreated))
                        return timeToString(convertMS(Date.now() - new Date(DateCreated)));
                    }
                }
            });
        });
        
        var createCommentVue = new Vue({
            el: '#createCommentVue',
            data: {
                comment: ''
            },
            methods: {
                createComment: function() {
                    $.post('/createcomment/'+reviewName+'/'+fileName+'/'+this.comment, (data) => {
                        window.location.reload();
                    });
                }
            }
        });
    }).fail(function(err) {
        if (err.status == 401)
          window.location = "/Verification/login.html"
      });
});

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return { days: d, hours: h, minutes: m, seconds: s };
};

function timeToString(time) {
    var str = '';
    if (time.days > 0){
        str += time.days + ' days ago';
    } else if (time.hours > 0) {
        str += time.hours + ' hours ago';
    } else if (time.minutes > 0) {
        str += time.minutes + ' minutes ago';
    } else {
        str += time.seconds + ' seconds ago';
    }
    return str;
}