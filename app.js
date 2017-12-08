const app = require('express')();
const axios = require('axios');
const cheerio = require('cheerio');

async function getIndexPage () {
  const str = await axios.get('https://laravel-china.org/topics');
  const body = str.data;
  const $ = cheerio.load(body);
  const item = [];
  $('ul.topic-list .list-group-item ').each(function (idx, element) {
    const $element = $(element);
    item.push({
      name: $element.find('.avatar>a').attr('title'),
      avatar: $element.find('.avatar>a>img').attr('src'),
      title: $element.find('.infos>.media-heading>a').text().replace(/ |\n/g, ''),
    })
  });
  return item;
}


app.use('/', async (req, res) => {
  const items = await getIndexPage();
  return res.json(items);
});

app.listen(3000);