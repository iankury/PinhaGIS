const randomInt = (p, q) => Math.floor(Math.random() * (q - p + 1)) + p
const toHex = x => x.toString(16).padStart(2, '0')
const mean = a => a.reduce((p, x) => p + x) / a.length
const sum = a => a.reduce((p, x) => p + x)
const encode = s => s.split('').map(x => x.charCodeAt(0)).join('a')

function fisherYates(a) {
  for (let i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function randomRGB() {
  let c = notTooDarkArray()
  const avg = mean(c)
  if (c.every(x => Math.abs(x - avg) < 50)) { // Too grey
    if (Math.random() > 0.1) { // Tolerate sometimes
      if (sum(c) < 300)  // Dark
        c[0] = Math.min(c[0] + 150, 255)
      else // Light
        c[0] = Math.max(c[0] - 150, 0)
      fisherYates(c) // Shuffle
    }
  }
  return '#' + c.map(x => toHex(x)).join('')
}

function notTooDarkArray() {
  let c
  do {
    c = []
    for (i = 0; i < 3; i++)
      c.push(randomInt(0, 255))
  } while (c.every(x => x < 100))
  return c
}

function escPressed() {
  $('#text').val('')
  return false
}

function apostrophePressed() {
  $('#color_picker').trigger('click')
  return false
}

function controlPressed() {
  const col = randomRGB()
  $('#text').css({
    color: col
  })
  return false
}

function enterPressed() {
  if ($('#text').val().length == 0)
    return false
  $.get(`/${encode($('#text').val())}`, data => {
    $('body').append('<div class="grid"></div>')
    for (x of data) {
      const img = new Image()
      img.onload = () => {
        if (img.complete && img.naturalWidth != 0)
          $('.grid').append($(img))
      }
      img.src = x
    }
  })
  return false
}

$('body').keydown(e => {
  if ($('.grid').length) {
    if (e.key == 'Escape') {
      $('.grid').remove()
      return escPressed()
    }
    return true
  }
  switch (e.key) {
    case 'Escape':
      return escPressed()
    case `'`:
      return apostrophePressed()
    case 'Control':
      return controlPressed()
    case 'Enter':
      return enterPressed()
    default:
      if (!$('#text').is(':focus')) 
        $('#text').focus()
  }
})

$('#color_picker').change(e => {
  $('#text').css({
    color: e.currentTarget.value
  })
})

$('#text').focus()