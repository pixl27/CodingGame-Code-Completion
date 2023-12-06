const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
});
  const page = await browser.newPage();

// navigate to a url https://www.codingame.com/ide/puzzle/the-descent
await page.goto('https://www.codingame.com/ide/puzzle/there-is-no-spoon-episode-1');

//get the inner text of the element that have the class "statement-body"
//wait for the element to appear


// check when a element is focused on the page
//repeat the mouse click every 2 seconds
// setInterval(async () => {
//   console.log('click');
//     await page.mouse.click(1200, 540); // replace 100, 200 with your actual coordinates
// }, 2000);
async function checkKeyPress(page) {
  const isKeyPressed = await page.evaluate(() => {
    return new Promise(resolve => {
      window.addEventListener('keydown', (event) => {
        if (event.key === 'k') {
          resolve(true);
        }
      });
    });
  });

  if (isKeyPressed) {
    let jsonglobal = [{
      "role": "system",
      "content":"You are an expert in Javascript coding , you dont forget something , you always make sure there is no error like const or variable assignement , change every constant to variable  , From now you gonna answer with the code only , you gonna give the full code that can resolve my problem , dont give example , give the full code , anything than that and you gonna be fired , if you give something ther than the code and commentary , you gonna be fired " }];
    console.log('k was pressed');
    await page.waitForSelector('.statement-body');
    const text = await page.evaluate(() => document.querySelector('.statement-body').innerText);
    await page.waitForSelector('.overflow-guard');
    const text2 = await page.evaluate(() => document.querySelector('.overflow-guard').innerText);
    await page.waitForSelector('.scroll-panel');
    const text3 = await page.evaluate(() => document.querySelector('.scroll-panel').innerText);
  //   console.log(text);
  //  console.log(text2);
    jsonglobal.push({ "role": "user", "content": text + " ####', fill the following code with the solution , after that return the FULL CODE  : '####'," + text2 + "####' and the solution should follow the 'regles' and the following test : '" + text3 + "' " });
    let data = JSON.stringify({
        "model": "gpt-3.5-turbo",//gpt-3.5-turbo
        "messages": jsonglobal      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '.trim()
        },
        data:data 
    };
    
    axios.request(config)
        .then(async response => {
            console.log(response.data.choices[0].message.content);
            let toreturn = response.data.choices[0].message.content;
            console.log(jsonglobal);
            //change .overflow-guard inner text to the text of the response
    //simulate a ctrl a and delete
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    //type the text in the editor
    await page.keyboard.type(toreturn);
    //clear jsonglobal
   // jsonglobal = [];
        })
        .catch(error => {
            console.error(error);
        });
 
//error handling
//         const errorElement = await page.$('.consoleError'); // replace '.consoleError' with your actual selector
// if (errorElement) {
//     const errorText = await page.evaluate(el => el.innerText, errorElement);
//     console.log(errorText);
//     jsonglobal.push({ "role": "system", "content": "fix the following error of the code i provide(give me the fixed code only) , the error :  " + errorText });
//     data = JSON.stringify({
//         "model": "gpt-3.5-turbo",//gpt-3.5-turbo
//         "messages": jsonglobal      
//     });
//     config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: '',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer '.trim()
//         },
//         data:data 
//     };
//     axios.request(config)
//     .then(async response => {
//         console.log(response.data.choices[0].message.content);
//         let toreturn = response.data.choices[0].message.content;
//         console.log(jsonglobal);
//         //change .overflow-guard inner text to the text of the response
// //simulate a ctrl a and delete
// await page.keyboard.down('Control');
// await page.keyboard.press('a');
// await page.keyboard.up('Control');
// await page.keyboard.press('Backspace');
// //type the text in the editor
// await page.keyboard.type(toreturn);
// //clear jsonglobal
// // jsonglobal = [];
//     })
//     .catch(error => {
//         console.error(error);
//     });
// }

    
   
 

  }

  // Check again after a delay
  setTimeout(() => checkKeyPress(page), 500);
}

checkKeyPress(page);



})();