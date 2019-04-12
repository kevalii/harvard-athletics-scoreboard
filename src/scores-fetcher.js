import rp from 'request-promise';
import cheerio from 'cheerio';

let urls =
  {
    "Baseball": "https://www.gocrimson.com/sports/bsb/2018-19/teams/harvard",
    "Men's Basketball": "https://www.gocrimson.com/sports/mbkb/2018-19/teams/harvard",
    "Football": "https://www.gocrimson.com/sports/fball/2018-19/teams/harvard",
    "Men's Ice Hockey": "https://www.gocrimson.com/sports/mice/2018-19/teams/harvard",
    "Men's Lacrosse": "https://www.gocrimson.com/sports/mlax/2018-19/teams/harvard",
    "Men's Soccer": "https://www.gocrimson.com/sports/msoc/2018-19/teams/harvard",
    "Men's Volleyball": "https://www.gocrimson.com/sports/mvball/2018-19/teams/harvard",
    "Women's Basketball": "https://gocrimson.com/sports/wbkb/2018-19/teams/harvard",
    "Field Hockey": "https://gocrimson.com/sports/fh/2018-19/teams/harvard",
    "Women's Ice Hockey": "https://gocrimson.com/sports/wice/2018-19/teams/harvard",
    "Women's Lacrosse": "https://gocrimson.com/sports/wlax/2018-19/teams/harvard",
    "Women's Soccer": "https://gocrimson.com/sports/wsoc/2018-19/teams/harvard",
    "Softball": "https://gocrimson.com/sports/sball/2018-19/teams/harvard",
    "Women's Volleyball": "https://gocrimson.com/sports/wvball/2018-19/teams/harvard"
}

let nurls = {
  "Baseball": "bsb",
  "Men's Basketball": "mbkb",
  "Football": "fball",
  "Men's Ice Hockey": "mice",
  "Men's Lacrosse": "mlax",
  "Men's Soccer": "msoc",
  "Men's Volleyball": "mvball",
  "Women's Basketball": "wbkb",
  "Field Hockey": "fh",
  "Women's Ice Hockey": "wice",
  "Women's Lacrosse": "wlax",
  "Women's Soccer": "wsoc",
  "Softball": "sball",
  "Women's Volleyball": "wvball"
}

// The current solution for getting gocrimson data is clientside web-scraping
// This requires that we bypass CORS, here by using a CORS proxy to fetch the
// the HTML; we use a local proxy server to accomplish this below, but we could
// alternatively use a public proxy (like https://cors-anywhere.herokuapp.com/),
// though it's less reliable

// Replace localhost with an proxy endpoint usable in production
const cors_query = url => rp("http://localhost:8081/" + url)

function scrape_data (html) {
  const $ = cheerio.load(html)
  const rows = $('table').first().find('tr')
  const categories = {}
  rows.each(function (i, el) {
    let elem = $(this).find('td')
    let data = []
    elem.each(function (i) {
      data.push($(this).text())
      // console.log($(this).text())
    })
    categories[data[0]] = data[1]
  })
  return categories
}

// Given a sport and some number n, get the urls for the schedules for the given
// sport for the last n academic years.
// Note that not all urls will be valid. Always provide error handling for any
// network request operating on a url generated here.
function url_generator (sport, n) {
  const curr_year = new Date().getFullYear()
  let ranges = []
  for (var i = 0; i < n; i++) {
    let end_year = (curr_year - i) % 2000
    let academic_year = `${curr_year - i - 1}-${(end_year < 10 ? '0' : '') + end_year}`
    ranges.push(academic_year)
  }
  const generate_url = (sport, year) => {
    return `https://www.gocrimson.com/sports/${sport}/${year}/teams/harvard`
  }
  return ranges.map(range => generate_url(sport, range))
}

// cors_query("https://www.gocrimson.com/sports/bsb/2017-18/teams/harvard").then(html => console.log(scrape_data(html)))
export default {cors_query, scrape_data, urls, nurls, url_generator};
