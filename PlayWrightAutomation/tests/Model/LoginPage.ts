import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly signIn: Locator;
  readonly cardTitles: Locator;
  readonly documentLink: Locator;
  readonly dropdown: Locator;
  readonly radioLast: Locator;
  readonly okayBtn: Locator;
  readonly terms: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator('#username');
    this.password = page.locator('[type="password"]');
    this.signIn = page.locator('#signInBtn');
    this.cardTitles = page.locator('.card-body a');
    this.documentLink = page.locator('[href*="documents-request"]');
    this.dropdown = page.locator('select.form-control');
    this.radioLast = page.locator('.radiotextsty').last();
    this.okayBtn = page.locator('#okayBtn');
    this.terms = page.locator('#terms');
  }

  async goto() {
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  }

  async login(username: string, password: string) {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.signIn.click();
  }

  async getErrorText() {
    return this.page.locator('[style*="block"]').textContent();
  }

  async getCardTitles() {
    return this.cardTitles.allTextContents();
  }

  async selectConsultOption() {
    await this.dropdown.selectOption('consult');
  }

  async selectLastRadio() {
    await this.radioLast.click();
    await this.okayBtn.click();
  }

  async checkTerms() {
    await this.terms.click();
  }

  async uncheckTerms() {
    await this.terms.uncheck();
  }
}