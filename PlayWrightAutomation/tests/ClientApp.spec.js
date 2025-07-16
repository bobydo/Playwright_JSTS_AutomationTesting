const { test, expect } = require('@playwright/test');




test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   let productName = ""; // Declare outside the loop
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Iamking@000");
   await page.locator("[value='Login']").click();
   // This is useful after actions like login or navigation, to ensure the page and its resources (API calls, images, etc.) have finished loading before continuing.
   // 'networkidle' is one of several load states in Playwright ('load', 'domcontentloaded', 'networkidle').
   await page.waitForLoadState('domcontentloaded');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   const count = await products.count();
   if (count === 0) {
      throw new Error('No products found on the page. Test cannot continue.');
   }
   productName = await products.nth(0).locator("b").textContent();
   await products.nth(0).locator("text= Add To Cart").click();
   // Wait for spinner to disappear
   const overlay = await page.locator('.ngx-spinner-overlay');
   console.log('Overlay count:', await overlay.count());
   console.log('Overlay visible:', await overlay.isVisible());
   // Now click the cart button
   await page.locator("[routerlink*='cart']").click();
   //await page.pause();

   await page.locator("div li").first().waitFor();
   const bool = await page.locator(`h3:has-text('${productName}')`).isVisible();
   expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();

   await page.locator("[placeholder*='Country']").pressSequentially("ind");
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }

   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);

   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");


   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();

});








