$(document).ready(function() {
  $('select').formSelect();
  checkUser();
});

$('#clear').click(function() {
  $('#signin-form').trigger('reset');
});

$('#submit-form').click(function(event) {
  event.preventDefault();

  const campo_json = {
    name: $('#name').val(),
    address: $('#address').val(),
    city: $('#cidade').val(),
    state: $('#estado')
      .val()
      .toUpperCase(),
    about: $('#textarea1').val(),
    site: $('#site').val(),
  };

  console.log(campo_json);

  $.ajax({
    url: 'http://134.209.114.75/airsoftspot/api/field',
    type: 'post',
    contentType: 'application/json',
    headers: { authorization: `Bearer ${  getCookie('token')}` },
    data: JSON.stringify(campo_json),
    success(data) {
      console.log(data);
      window.location.href = '/campo';
    },
    error(e) {
      alert(JSON.stringify(e));
    },
  });
});

$('#logout').click(function(event) {
  document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  window.location.href = '/';
});

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function checkUser() {
  name = getCookie('name');

  if (name != '') {
    $('#boas-vindas-nome').html(name);
    $('#boas-vindas').show();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(0)
      .show();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(1)
      .hide();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(2)
      .hide();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(3)
      .show();
  } else {
    $('#boas-vindas')
      .parent()
      .children()
      .eq(0)
      .hide();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(1)
      .show();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(2)
      .show();
    $('#boas-vindas')
      .parent()
      .children()
      .eq(3)
      .hide();
  }
}
