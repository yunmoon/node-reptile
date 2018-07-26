const app = require('express')();
const axios = require('axios');
const cheerio = require('cheerio');

async function getIndexPage (filter = 'default', page = 1) {
  const str = await axios.get(`https://laravel-china.org/topics?filter=${filter}&page=${page}`);
  const body = str.data;
  const $ = cheerio.load(body);
  const item = [];
  $('ul.topic-list .list-group-item ').each(function (idx, element) {
    const $element = $(element);
    item.push({
      name: $element.find('.avatar>a').attr('title'),
      avatar: $element.find('.avatar>a>img').attr('src'),
      title: $element.find('.infos>.media-heading>a').text().replace(/ |\n/g, ''),
      url: $element.find('.infos>.media-heading>a').attr('href'),
      time: $element.find('.reply_count_area>.count_set>.timeago').text(),
      label: $element.find('.infos>.media-heading>.label').text(),
    })
  });
  return item;
}


app.get('/topics', async (req, res) => {
  const items = await getIndexPage(req.query.filter, req.query.page);
  return res.json(items);
});

app.listen(3000);