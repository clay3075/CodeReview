
$.get('/reviews', function(data) {
  reviews = JSON.parse(data);
  var reviews = new Vue({
    el: '#reviews',
    data: {
      reviews: reviews
    }
  })
});

