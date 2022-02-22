// Descrição: Pegar as paginas web  do myanimelist,
// Pagina de anime
// Todos os amigos, usar o puppeter, para pegar todos os amigos, 
// e depois fazer uma requisação para cada amigo, e pegar seu dados de animes.

{
  // const req = url => {
  //   https.get(url, (res) => {
  //     // const { html } = res
  //     res.on('data', d => {
  //       const data = cheerio.load(d)
  //       let algo = data('//*[@id="content"]/div/div[2]/div/div[3]/div[1]/div[2]/div[1]/a').text
  //       console.log(algo)
  //     })
  //   })
  // }
}

{
  // const getFriends = async nameUser => {
//   try {
//     const { data } = await axios.get(`https://myanimelist.net/profile/${nameUser}/friends`);
//     const $ = cheerio.load(data)
//     getLink($)

//   } catch (error) {
//     console.error(error);
//   }
// }
}

const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')
const pup = require('puppeteer')

const links = []

const saveFile = (nameUser, data) => {
  fs.appendFile(`out/${nameUser}.json`, JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Ok!');
  });
}

const getPage = async nameUser => {
  try {
    const { data } = await axios.get(`https://myanimelist.net/animelist/${nameUser}/load.json?offset=0&status=7`);
    saveFile(nameUser, data)
    return data;
  } catch (error) {
    console.error(error);
  }
}

const getLink = data => {
  if (data('div.spaceit').text() == "No friends found :("){
    return true
  }
  data('div.title > a').each(( _, el) => {
    const nameUsers = data(el).text()
    links.push(nameUsers)
  });
  return false
}

const getFriends = async nameUser => {
	try {
    const browser = await pup.launch(/*{ headless: false }*/);
    for(let i = 1; true; i++) {
      const URL = `https://myanimelist.net/profile/${nameUser}/friends?p=${i}`;

      const page = await browser.newPage();
      await page.goto(URL, {waitUntil: 'load', timeout: 0});
      const content = await page.content();

      const $ = cheerio.load(content);
      
      if(getLink($)) break;
      console.log(i);
      await page.close();
    }
		await browser.close();
	} catch (error) {
		console.error(error);
	}
}

const getProfile = async nameUser => {
	try {
    const { data } = await axios.get(`https://myanimelist.net/profile/${nameUser}`);
    const $ = cheerio.load(data);
    const status = [] 
    $("ul.user-status > li.clearfix > span").filter((index, value) => {
      if ((index + 1) % 2 == 0) {
        return value
      }
    }).each((_, el) => {
      status.push($(el).text())
    })

    console.log(status)
    
	} catch (error) {
		console.error(error);
	}
}

(async () => {
  getProfile("Abajur")
  // await getFriends("Abajur");
  // fs.appendFile(`user.json`, JSON.stringify(links), err => {
  //   if (err) throw err;
  //   console.log('Ok!');
  // });
  // links.forEach(name => {
  //   getPage(name)
  // })
})();

// console.log(0%2)
