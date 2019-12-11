$(document).ready(function() {
  $('select').formSelect();
  checkUser();
});

$('#login').click(function(event) {
  const login_json = {
    email: $('#email').val(),
    password: $('#password').val(),
  };

  console.log(login_json);

  $.ajax({
    url: 'http://134.209.114.75/airsoftspot/api/session',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(login_json),
    success(data) {
      name = data.user.name;
      token = data.token;
      document.cookie = `name=${name}`;
      document.cookie = `token=${token}`;

      window.location.href = '/';
    },
    error(e) {
      alert(JSON.stringify(e));
    },
  });
});

$('#logout').click(function(event) {
  document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  location.reload();
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
