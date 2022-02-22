const fs = require('fs')
const axios = require('axios')

const oisa = []

const getPage = async nameUser => {
  try {
    const {
      status
    } = await axios.get(`https://instagram.com/${nameUser}`);
    if (status === 200) {
      return nameUser
    }
  } catch (error) {
    console.error(error);
  }
}

const jsonData = fs.readFileSync("./user.json", "utf8");

// (async () => {
//     JSON.parse(jsonData).forEach(async element => {
//       await getPage(element)
//   });
// })()
let coisa
(async () => {
  coisa = JSON.parse(jsonData).map(a => getPage(a).then(res => {
    oisa.push(res)
    fs.appendFile(`user.json`, JSON.stringify(oisa), err => {
      if (err) throw err;
      console.log('Ok!');
    });
  }))
  // coisa.then(res => {
  //   console.log(res)})
  // console.log(coisa)
})()