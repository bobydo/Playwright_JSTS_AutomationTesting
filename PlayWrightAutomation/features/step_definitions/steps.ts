const { exec } = require("child_process");
const { defineParameterType, When, Given, Then } = require("@cucumber/cucumber");
const path = require("path");
const playwright = require('@playwright/test');
import { test, Locator, Page, expect } from '@playwright/test';
const { POManager } = require('../../pageobjects/POManager');
const assert = require("assert");
const binDir = path.resolve(__dirname, "../../bin");
console.log(binDir);

let poManager: { getOrdersHistoryPage: () => any; getOrdersReviewPage: () => any; getCartPage: () => any; getDashboardPage: () => any; getLoginPage: () => any; };

interface CustomWorld {
  page?: Page;
  dashboardPage?: any;
  cartPage?: any;
  orderId?: string;
  stdout?: string;
}

defineParameterType({
  name: "command",
  regexp: /`(.+)`/,
  transformer: (cmd: any) => cmd,
});

When("I run {string}", function (this: CustomWorld, string: any) {
  console.log(string);
  this.stdout = string;
});

Then('Verify order is present in the OrderHistory', async function (this: CustomWorld) {
  await this.dashboardPage?.navigateToOrders();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(this.orderId!);
  expect(this.orderId!.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});

When('Enter valid details and Place the Order', async function (this: CustomWorld) {
  await this.cartPage?.Checkout();
  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(this.orderId);
});

Then('Verify {string} is displayed in the Cart', async function (this: CustomWorld, productName: string) {
  this.cartPage = poManager.getCartPage();
  await this.cartPage.VerifyProductIsDisplayed(productName);
});

When('Add {string} to Cart', async function (this: CustomWorld, productName: string) {
  this.dashboardPage = poManager.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, async function (this: CustomWorld, username: string, password: string) {
  poManager = new POManager(this.page!);
  const products = this.page!.locator(".card-body");
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(username, password);
});

Then("the stdout should contain {string}", function (this: CustomWorld, string: string) {
  assert.equal(this.stdout, string);
});

Given(/^a table step$/, function (this: CustomWorld, table: any) {
  const expected = [
    ['Apricot', '5'],
    ['Brocolli', '2'],
    ['Cucumber', '10']
  ];
  assert.deepEqual(table.rows(), expected);
});

Given('a login to Ecommerce2 application with {string} and {string}', { timeout: 100 * 1000 }, async function (this: CustomWorld, username: string, password: string) {
  const userName = this.page!.locator('#username');
  const signIn = this.page!.locator("#signInBtn");
  const cardTitles = this.page!.locator(".card-body a");
  await this.page!.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await this.page!.title());
  await userName.fill("rahulshetty");
  await this.page!.locator("[type='password']").fill("learning");
  await signIn.click();
});

Then('Verify Error message is displayed', async function (this: CustomWorld) {
  await expect(this.page!.locator("[style*='block']")).toContainText('Incorrect');
});