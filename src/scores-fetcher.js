import rp from 'request-promise';
import cheerio from 'cheerio';

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


/** cors_query
 * The current solution for getting gocrimson data is clientside web-scraping
 * This requires that we bypass CORS, here by using a CORS proxy to fetch the
 * the HTML; we use a local proxy server to accomplish this below, but we could
 * alternatively use a public proxy (like https://cors-anywhere.herokuapp.com/),
 * though it's less reliable
 */

// Replace localhost with an proxy endpoint usable in production
const cors_query = url => rp("http://localhost:8081/" + url)

function scrape_data (url) {
  return new Promise((resolve, reject) => {
    cors_query(url).then(html => {
      const $ = cheerio.load(html)
      const rows = $('table').first().find('tr')
      const categories = {}
      rows.each(function (i, el) {
        let elem = $(this).find('td')
        let data = []
        elem.each(function (i) {
          data.push($(this).text())
        })
        categories[data[0]] = data[1]
      })
      resolve(categories)
    }).catch(e => reject(e))
  })
}

/** get_urls
 * Given a sport and some number n, get the urls for the schedules for the given
 * sport for the last n academic years. Note that not all urls will be valid.
 * Always provide error handling for any network request operating on a url generated here.
 * Example usage:
 * get_urls(nurls["Baseball"], 5) returns urls for last 5 baseball seasons
 */
const get_urls = (sport, n) => {
  const curr_year = new Date().getFullYear()
  let ranges = []
  for (var i = 0; i <= n; i++) {
    // Harvard probably won't make it to 2100
    let end_year = (curr_year - i) % 2000
    let academic_year = `${curr_year - i - 1}-${(end_year < 10 ? '0' : '') + end_year}`
    ranges.push(academic_year)
  }
  const generate_url = (sport, year) => {
    return `https://www.gocrimson.com/sports/${sport}/${year}/teams/harvard`
  }
  return ranges.reduce((acc, cur, idx, src) => {
    if (idx == 1) {
      acc = {}
    }
    acc[cur] = generate_url(sport, cur)
    return acc
  })
}

const call_urls = async urls => {
  return Promise.all(Object.keys(urls).map(async url => scrape_data(urls[url])))
}

const test_call = async () => {
  return await call_urls(get_urls(nurls["Baseball"], 5))
}

// test_call ()
// scrape_data("https://www.gocrimson.com/sports/bsb/2017-18/teams/harvard").then(data => console.log(data))
export default {call_urls, nurls, get_urls};
