const { exec } = require("child_process")
const { defineParameterType, When, Given,Then } = require("@cucumber/cucumber")
const path = require("path")
const { expect } = require('@playwright/test');
let poManager;
const {POManager} = require('../../pageobjects/POManager');
const assert = require("assert")
const binDir = path.resolve(__dirname, "../../bin")
console.log(binDir)

const { chromium, firefox, webkit } = require('playwright');
const { Before,setDefaultTimeout } = require('@cucumber/cucumber');
// Set default timeout for all steps and hooks (e.g., 60 seconds)
setDefaultTimeout(60 * 1000);

Before(async function () {
  let browserType = process.env.BROWSER || 'chromium';
  if (browserType === 'chromium') {
    console.log('Launching browser in headless mode...');
    this.browser = await chromium.launch({ headless: true });
  } else if (browserType === 'firefox') {
    this.browser = await firefox.launch({ headless: true });
  } else if (browserType === 'webkit') {
    this.browser = await webkit.launch({ headless: true });
  }
  //this.page = await this.browser.newPage();
});

defineParameterType({
  name: "command", 
  regexp: /`(.+)`/,
  transformer: (cmd) => cmd,
})

When("I run {string}", function (string) {
  console.log(string)
  this.stdout = string;
  
  })

Then('Verify order is present in the OrderHistory', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(this.orderId);
   expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  });

When('Enter valid details and Place the Order', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(this.orderId);
});

Then('Verify {string} is displayed in the Cart', async function (productName) {
    // Write code here that turns the phrase above into concrete actions
    this.cartPage = poManager.getCartPage();
    await this.cartPage.VerifyProductIsDisplayed(productName);
});

When('Add {string} to Cart', async function (productName) {
    // Write code here that turns the phrase above into concrete actions
     this.dashboardPage = poManager.getDashboardPage();
     await this.dashboardPage.searchProductAddCart(productName);
     await this.dashboardPage.navigateToCart();
});

Given('a login to Ecommerce application with {string} and {string}', {timeout: 100 * 1000}, async function (username,password) {
  poManager = new POManager(this.page);
  //js file- Login js, DashboardPage
  const products = this.page.locator(".card-body");
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(username,password);
});

Then("the stdout should contain {string}", function (string) {
  assert.equal(this.stdout, string)
})

Given(/^a table step$/, function(table) {
        const expected = [
          ['Apricot', '5'],
          ['Brocolli', '2'],
          ['Cucumber', '10']
        ]
        assert.deepEqual(table.rows(), expected)
})


Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {    
    // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
    const userName = this.page .locator('#username');
    const signIn = this.page .locator("#signInBtn");
    const cardTitles =  this.page .locator(".card-body a");
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await this.page.title());
    //css 
    await userName.fill("rahulshetty");
    await this.page .locator("[type='password']").fill("learning");
    await signIn.click();   
});


Then('Verify Error message is displayed', async function () {
    await expect(this.page .locator("[style*='block']")).toContainText('Incorrect');
})