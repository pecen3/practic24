const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
    const browser = await puppeteer.launch({headless: true, args: ['--window-size=1920,1080']});
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) 
    Chrome/123.0.6312.124 Safari/537.3`);

    await page.goto(url, {waitUntil: 'load'});
    await new Promise(resolve => setTimeout(resolve, 2000));
    let title, price;
    try {
        if (url.includes('market.yandex.ru')) {
            title = await page.$eval('h1[data-auto="productCardTitle"]', element => element.innerText);
            const priceDataJson = await page.$eval('div[data-zone-name="cpa-offer"]', 
            element => element.getAttribute('data-zone-data'));
            const priceData = JSON.parse(priceDataJson);
            price = priceData.price;
        } else if (url.includes('ozon.ru')) {
            title = await page.$eval('h1.lw5', element => element.innerText);
            price = await page.$eval('span.vl5.v3l', element => element.innerText.replace(/\D/g, ''));
        } else if (url.includes('wildberries.ru')) {
            title = await page.$eval('h1.product-page__title', element => element.innerText.trim());
            price = await page.$eval('span.price-block__wallet-price', 
                                        element => element.innerText.replace(/\s/g, '').replace('₽', '').trim());
        } else {
            console.log('URL не поддерживается');
            return {url, title: "URL не поддерживается", price: "URL не поддерживается"};
        }
    } catch (error) {
        return error
    } finally {
        await browser.close();
    }
    console.log({url, title, price})
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {url, title, price}; 
}

module.exports ={
    scrapeWebsite
}
// async function performScraping() {
//     const result1 = await scrapeWebsite('https://market.yandex.ru/product--core-i5-12400f/1498189449?sku=101556122792&do-waremd5=Xjc8jm1VkdLMQgicADKIYg&uniqueId=1353549');
//     console.log(result1);
// }

// performScraping();