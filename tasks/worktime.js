const puppeteer = require('puppeteer')
const fs = require('fs').promises;
const config = require('../config/config')

describe('add working hours not because you are lazy but because you have something more important to do', ()=>{
    it('should add working hours correctingFilter', async function () {
            const browser = await puppeteer.launch({
                headless: config.headless,
                ignoreHTTPSErrors: true,
                args: [
                  "--proxy-server='direct://'",
                  '--proxy-bypass-list=*',
                  '--disable-gpu',
                  '--disable-dev-shm-usage',
                  '--disable-setuid-sandbox',
                  '--no-first-run',
                  '--no-sandbox',
                  '--no-zygote',
                  '--single-process',
                  '--ignore-certificate-errors',
                  '--ignore-certificate-errors-spki-list',
                  '--enable-features=NetworkService'
                ]
              });
            const page = await browser.newPage()
            try {
              const cookiesString = await fs.readFile('./cookies.json');
              const cookies = JSON.parse(cookiesString);
              await page.setCookie(...cookies);
            }
            catch(ex){
              console.warn(ex);
              await page.goto(config.externalUrlForTimeCorrection)
              await page.waitForTimeout(2000)
              await page.type('#i0116', config.email)
              await page.click('#idSIButton9')
              await page.waitForTimeout(2000)
              await page.type('#i0118', config.accountPass)
              await page.click('#idSIButton9')
              await page.waitForTimeout(12000)
              const cookies = await page.cookies();
              await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
            }
            await page.goto(config.externalUrlForTimeCorrection)
            await page.type('#txtUser', config.username)
            await page.type('#txtPassword', config.password)
            await page.click("#btnLogin")
            await page.waitForNavigation() 
            await page.waitForTimeout(5000)
            const frame = await page.frames().find(frame => frame.name() === 'Stage');
            await frame.evaluate(() => {
                const trs = Array.from(document.querySelectorAll('table#SectionGrid_Zeitkorrekturen1_SectionNA_DgNormabweichungen tbody tr'))
                trs[0].children[0].children[0].click();
            })
            await page.waitForTimeout(2000)
            await frame.evaluate(() => {
              document.querySelector("#SectionGrid_Zeitkorrekturen1_SectionForm_MenuAktionen_Aktionen_SubAktionen_102").click()
            })
            await page.waitForTimeout(2000)
            await frame.type("#SectionGrid_Zeitkorrekturen1_SectionForm_TimeChooser_Von_TimeChooser_Von_TxtTime",config.workingFromTime)
            await frame.type("#SectionGrid_Zeitkorrekturen1_SectionForm_TimeChooser_Bis_TimeChooser_Bis_TxtTime",config.workingTillTime)
            await frame.click("#SectionGrid_Zeitkorrekturen1_SectionForm_btnOk")
            await frame.type("#SectionGrid_Zeitkorrekturen1_SectionForm_RepZeitkontoEdit_ctl00_NumberEditVG_AutoCompleteTextBox","20")
            await frame.click("#SectionGrid_Zeitkorrekturen1_SectionForm_btnSpeichern")
            browser.close()
    })
})
