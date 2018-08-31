$( document ).ready(function() {
  $.get('/reviews', function(data) {
    reviews = JSON.parse(data);
    var reviews = new Vue({
      el: '#reviews',
      data: {
        reviews: reviews
      }
    });
  });

  var modalVue = new Vue({
    el: '#modalVue',
    data: {
      reviewName: ''
    },
    methods: {
      createNewReview: function () {
        console.log(this.reviewName);
        $.post('/create/' + this.reviewName, function(data) {
          location.reload();
        });
      }
    }
  });
});
