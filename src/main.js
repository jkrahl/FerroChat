import '../style.scss'
import OpenAI from './openai'

let assistant_id = localStorage.getItem('assistant_id')
let api_key = localStorage.getItem('api_key')

if (!assistant_id || !api_key) {
  assistant_id = prompt('Enter assistant ID')
  localStorage.setItem('assistant_id', assistant_id)
  api_key = prompt('Enter API Key')
  localStorage.setItem('api_key', api_key)
}

let openAI = new OpenAI(api_key, assistant_id)
console.log(openAI)

var $messages = $('.messages-content'),
  d,
  h,
  m,
  i = 0

$(window).load(function () {
  $messages.mCustomScrollbar()
  setTimeout(function () {
    fakeMessage()
  }, 0)
})

function updateScrollbar() {
  $messages.mCustomScrollbar('update').mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0,
  })
}

function setDate() {
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes()
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo(
      $('.message:last')
    )
  }
}

function insertMessage() {
  msg = $('.message-input').val()
  if ($.trim(msg) == '') {
    return false
  }
  $('<div class="message message-personal">' + msg + '</div>')
    .appendTo($('.mCSB_container'))
    .addClass('new')
  setDate()
  $('.message-input').val(null)
  updateScrollbar()
  setTimeout(function () {
    requestMessage(msg)
  }, 0)
}

$('.message-submit').click(function () {
  insertMessage()
})

$(window).on('keydown', function (e) {
  if (e.which == 13) {
    insertMessage()
    return false
  }
})

var Fake = [
  "Hola, Soc l'asistent virtual d'FGC, en que et puc ayudar? ",
  'Para ir de Plaza Cataluña a la UAB en FGC:\nVe a la estación de FGC en Plaza Cataluña.\nToma la línea S2 (Sabadell) o S6 (Universitat Autònoma).\nBaja en la estación "Universitat Autònoma".\nEl trayecto dura aproximadamente 30-35 minutos.',
  'El seiguente S2 pasa en 2 min en via 2',
  'Es todalmente accesible',
  'En esta hora el tren esta vacio',
  "That's awesome",
  'Codepen is a nice place to stay',
  "I think you're a nice person",
  'Why do you think that?',
  'Can you explain?',
  "Anyway I've gotta go now",
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)',
]

function requestMessage(question) {
  if ($('.message-input').val() != '') {
    return false
  }

  $(
    '<div class="message loading new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure><span></span></div>'
  ).appendTo($('.mCSB_container'))
  updateScrollbar()

  const api_key = prompt('Enter key:')
  const assistant_id = 'asst_FJbVXwdh6WiBA6yAQ6LniqOU'
  const thread_id = 'thread_M0hf36GzRZbNYrcyEJFaKsgE'

  console.log(`${api_key}`)
  fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
    body: {
      role: 'user',
      content: `${question}`,
    },
    headers: {
      Authorization: `Bearer ${api_key}`,
      'Content-Type': 'application/json',
      'Openai-Beta': 'assistants=v2',
    },
    method: 'POST',
  })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
        body: {
          assistant_id: `${assistant_id}`,
        },
        headers: {
          Authorization: `Bearer ${api_key}`,
          'Content-Type': 'application/json',
          'Openai-Beta': 'assistants=v2',
        },
        method: 'POST',
      })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
            headers: {
              Authorization: `Bearer ${api_key}`,
              'Content-Type': 'application/json',
              'Openai-Beta': 'assistants=v2',
            },
          })
            .then((response) => {
              return response.json()
            })
            .then((json) => {
              console.log(json)
              const chatResponse = json.data[0].content[0].text.value

              $('.message.loading').remove()
              $(
                '<div class="message new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure>' +
                  chatResponse +
                  '</div>'
              )
                .appendTo($('.mCSB_container'))
                .addClass('new')

              setDate()
              updateScrollbar()
              i++
            })
        })
    })
}

function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false
  }

  $(
    '<div class="message loading new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure><span></span></div>'
  ).appendTo($('.mCSB_container'))
  updateScrollbar()

  setTimeout(function () {
    $('.message.loading').remove()
    $(
      '<div class="message new"><figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FGC_logo_%282019%29.svg/2048px-FGC_logo_%282019%29.svg.png" /></figure>' +
        Fake[i] +
        '</div>'
    )
      .appendTo($('.mCSB_container'))
      .addClass('new')
    setDate()
    updateScrollbar()
    i++
  }, 500 + Math.random() * 20 * 100)
}

console.log('main.js loaded')
