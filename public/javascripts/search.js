(function () {
  var $suggests = $('.suggests');
  var $suggestTemplate = $('.suggest-item.template');

  $.fn.search = function (callback, timeout) {
    timeout = timeout || 500;
    var interval = 0;

    this.on('input', function (e) {
      clearTimeout(interval);
      interval = setTimeout(callback, timeout, e);
    });
  }

  function removeUncheckedSuggests () {
    $('.suggest-item')
      .filter(function() {
        return !$(this)
          .children('.include-suggest')
          .is(':checked');
      })
      .remove();
  }

  $('#search').search(function (e) {
    removeUncheckedSuggests();
    if (e.target.value) {
      $.getJSON('/contacts?q=' + e.target.value)
        .done(function (contacts) {
          for (var i = 0, len = contacts.length; i < len; i++) {
            var contact = contacts[i];
            var $suggest = $suggestTemplate.clone().removeClass('hide', 'template');
            $suggest.appendTo($suggests);
            $suggest.children('.include-suggest').val(contact.id);
            $suggest.children('.name').text(contact.title);
            if (contact['gd:organization']) {
              var orgName = contact['gd:organization']['gd:orgName'] || '';
              var orgTitle = contact['gd:organization']['gd:orgTitle'] || '';
              $suggest.children('.job').text(orgName + orgTitle);
            }
          }
        })
    }
  });
})();

