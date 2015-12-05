var rotate_description = function () {
  var description_span = $("#self_description");

  // get a description
  var description = window._description_data[window._description_idx];
  window._description_idx++;
  if (window._description_idx >= window._description_data.length) {
    window._description_data = _fisher_yates(window._description_data);
    window._description_idx = 0;
  }

  description_span.fadeOut(function () {
    description_span.html(description);
    description_span.fadeIn();
    window.setTimeout(rotate_description, 10000);
  });
}

var _fisher_yates = function (arr) {
  var i, swapIdx;
  for (i = arr.length; i > 0; --i) {
    swapIdx = Math.floor(Math.random() * i);
    var tmp = arr[i];
    arr[i] = arr[swapIdx];
    arr[swapIdx] = arr[i];
  }
  return arr;
}

var _page_setup = function () {
  $.get("/assets/descriptions.json", function (data, success, jqXHR) {
    window._description_idx = 0;
    window._description_data = _fisher_yates(data);
    rotate_description();
  });
}

window._page_setup = _page_setup;
