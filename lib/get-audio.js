/**
 * Get audio
 * https://www.freesoundeffects.com/free-sounds/animals-10013/1/tot_sold/100/
 */

// Dependencies
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Get
fetch('https://www.freesoundeffects.com/free-sounds/animals-10013/1/tot_sold/100/')
  .then(function(res) {
    return res.text();
  })
  .then(function(body) {
    let $ = cheerio.load(body);
    $('.infoSound').each(function() {
      let $this = $(this);
      let description = $this.find('.soundDescription .trackinfo').text();
      let mp3 = 'https://www.freesoundeffects.com/' + $this.find('#btndlmp3').attr('href');

      console.log(description, mp3);
    });
  });
