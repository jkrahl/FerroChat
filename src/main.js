import "../style.scss";

var $messages = $(".messages-content"),
  d,
  h,
  m,
  i = 0;

$(window).load(function () {
  $messages.mCustomScrollbar();
  setTimeout(function () {
    fakeMessage();
  }, 0);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar("scrollTo", "bottom", {
    scrollInertia: 10,
    timeout: 0,
  });
}

function setDate() {
  d = new Date();
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ":" + m + "</div>").appendTo(
      $(".message:last")
    );
  }
}

function insertMessage() {
  msg = $(".message-input").val();
  if ($.trim(msg) == "") {
    return false;
  }
  $('<div class="message message-personal">' + msg + "</div>")
    .appendTo($(".mCSB_container"))
    .addClass("new");
  setDate();
  $(".message-input").val(null);
  updateScrollbar();
  setTimeout(function () {
    requestMessage(msg);
  }, 0);
}

$(".message-submit").click(function () {
  insertMessage();
});

$(window).on("keydown", function (e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});

var Fake = [
  "Hola, Soc la Ferrita, en que et puc ayudar? ",
  'Para ir de Plaza Cataluña a la UAB en FGC:\nVe a la estación de FGC en Plaza Cataluña.\nToma la línea S2 (Sabadell) o S6 (Universitat Autònoma).\nBaja en la estación "Universitat Autònoma".\nEl trayecto dura aproximadamente 30-35 minutos.',
  "El seiguente S2 pasa en 2 min en via 2",
  "Es todalmente accesible",
  "En esta hora el tren esta vacio",
  "That's awesome",
  "Codepen is a nice place to stay",
  "I think you're a nice person",
  "Why do you think that?",
  "Can you explain?",
  "Anyway I've gotta go now",
  "It was a pleasure chat with you",
  "Time to make a new codepen",
  "Bye",
  ":)",
];

function requestMessage(question) {
  if ($(".message-input").val() != "") {
    return false;
  }

  $(
    '<div class="message loading new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure><span></span></div>'
  ).appendTo($(".mCSB_container"));
  updateScrollbar();

  fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      $(".message.loading").remove();
      console.log(json);
      $(
        '<div class="message new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure>' +
          json["joke"] +
          "</div>"
      )
        .appendTo($(".mCSB_container"))
        .addClass("new");

      setDate();
      updateScrollbar();
      i++;
    });
  //  setTimeout(function() {
  //    $('.message.loading').remove();
  //    $('<div class="message new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
  //    setDate();
  //    updateScrollbar();
  //    i++;
  //  }, 500 + (Math.random() * 20) * 100);
}

function fakeMessage() {
  if ($(".message-input").val() != "") {
    return false;
  }

  $(
    '<div class="message loading new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure><span></span></div>'
  ).appendTo($(".mCSB_container"));
  updateScrollbar();

  setTimeout(function () {
    $(".message.loading").remove();
    $(
      '<div class="message new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure>' +
        Fake[i] +
        "</div>"
    )
      .appendTo($(".mCSB_container"))
      .addClass("new");
    setDate();
    updateScrollbar();
    i++;
  }, 500 + Math.random() * 20 * 100);
}
