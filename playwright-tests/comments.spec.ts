// NOTE: WIP - do not review yet

import { test, expect } from "@playwright/test";
import { customAlphabet } from "nanoid";

const baseTestData = {
  rootUser: "trenton",
  secondUser: "mobley",
  colonyName: "fsociety",
  displayName: "F Society",
  tokenName: "ECorp Coin",
  tokenSymbol: "ECOIN",
  secondTeamName: "Dark Army",
};

const getRandomTestData = (data: keyof typeof baseTestData) => {
  const nanoid = customAlphabet("1234567890qwertyuiopasdfghjklzxcvbnm", 4);
  return `${baseTestData[data]}-${nanoid().toLowerCase()}`; // the toLowerCase is important since colonyName is lowercased
};

// TODO abstract and refactor this away
const displayName = getRandomTestData("displayName");
const colonyName = getRandomTestData("colonyName");

test("create a colony", async ({ page }) => {
  // this is the total timeout
  test.setTimeout(3 * 60 * 1000); // 3 minutes

  // Go to http://127.0.0.1:9090/connect
  await page.goto("http://127.0.0.1:9090/connect");

  // Click button:has-text("GanacheUse wallet from Ganache (dev mode only)")
  await page
    .locator(
      'button:has-text("GanacheUse wallet from Ganache (dev mode only)")'
    )
    .click();

  // Click [aria-label="Account"]
  await page.locator('[aria-label="Account"]').click();

  // Click text=0xb77d57f4959eafa0339424b83fcfaf9c15407461(selected)
  await page
    .locator("text=0xb77d57f4959eafa0339424b83fcfaf9c15407461(selected)")
    .click();

  // Click text=Continue
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://127.0.0.1:9090/create-user' }*/),
    page.locator("text=Continue").click(),
  ]);

  // If this is our first loggin in to this page before

  const rootUserName = baseTestData["rootUser"]; // TODO think about this
  if (page.url() === "http://127.0.0.1:9090/create-user") {
    // Fill input[name="username"]
    await page.locator('input[name="username"]').fill(rootUserName);

    // Click [data-test="claimUsernameConfirm"]
    await page.locator('[data-test="claimUsernameConfirm"]').click();
  }

  // Now we are on the landing page

  // Click a:has-text("Create a colony")
  await page.locator('a:has-text("Create a colony")').click();
  await expect(page).toHaveURL("http://127.0.0.1:9090/create-colony");

  // Fill input[name="displayName"]
  await page.locator('input[name="displayName"]').fill(displayName);

  // Fill input[name="colonyName"]
  await page.locator('input[name="colonyName"]').fill(colonyName);

  await page.screenshot();

  // Click [data-test="claimColonyNameConfirm"]
  await page.locator('[data-test="claimColonyNameConfirm"]').click();

  // Click button:has-text("Create a new tokenFor example: MyAwesomeToken")
  await page
    .locator('button:has-text("Create a new tokenFor example: MyAwesomeToken")')
    .click();

  const tokenName = baseTestData["tokenName"];
  const tokenSymbol = baseTestData["tokenSymbol"];

  // Fill input[name="tokenName"]
  await page.locator('input[name="tokenName"]').fill(tokenName);

  // Fill input[name="tokenSymbol"]
  await page.locator('input[name="tokenSymbol"]').fill(tokenSymbol);

  // Click [data-test="definedTokenConfirm"]
  await page.locator('[data-test="definedTokenConfirm"]').click();

  // Click [data-test="userInputConfirm"]
  await page.locator('[data-test="userInputConfirm"]').click();

  // We are doing this cause we need to wait for all the things getting done TODO refactor this
  // Click text=New Action
  await page.locator("text=New Action").click();
});

test("do an action (mint some token) and comment on it", async ({ page }) => {
  await page.goto(`http://127.0.0.1:9090/colony/${colonyName}`);

  // Click text=New Action
  await page.locator("text=New Action").click();

  // Click div[role="button"]:has-text("Manage FundsThe tools you need to manage your colony’s money.")
  await page
    .locator(
      'div[role="button"]:has-text("Manage FundsThe tools you need to manage your colony’s money.")'
    )
    .click();

  // Click div[role="dialog"] div:has-text("Manage Funds") >> nth=1
  await page
    .locator('div[role="dialog"] div:has-text("Manage Funds")')
    .nth(1)
    .click();

  // Click div[role="button"]:has-text("Mint TokensNeed more tokens? Cook up a batch here.")
  await page
    .locator(
      'div[role="button"]:has-text("Mint TokensNeed more tokens? Cook up a batch here.")'
    )
    .click();

  // Click input[name="mintAmount"]
  await page.locator('input[name="mintAmount"]').click();

  // Fill input[name="mintAmount"]
  await page.locator('input[name="mintAmount"]').fill("100,000,0000");

  // Click text=Confirm
  await page.locator("text=Confirm").click();

  // Click textarea[name="message"]
  await page.locator('textarea[name="message"]').click();

  // Fill textarea[name="message"]
  await page
    .locator('textarea[name="message"]')
    .fill("First comment which will be deleted.");

  // Press Enter
  await page.locator('textarea[name="message"]').press("Enter");

  // Click text=trenton minted 1000000000 KOT to hhaha15 seconds agoNoexplorertrentonnowFirst co >> button
  await page
    .locator(
      "text=trenton minted 1000000000 KOT to hhaha15 seconds agoNoexplorertrentonnowFirst co >> button"
    )
    .click();

  // Click button:has-text("Delete comment")
  await page.locator('button:has-text("Delete comment")').click();

  // Click button:has-text("Delete")
  await page.locator('button:has-text("Delete")').click();

  // Click textarea[name="message"]
  await page.locator('textarea[name="message"]').click();

  // Fill textarea[name="message"]
  await page
    .locator('textarea[name="message"]')
    .fill("Second comment which will not be deleted.");

  // Press Enter
  await page.locator('textarea[name="message"]').press("Enter");

  // Click main div:has-text("trenton15 seconds agoFirst comment which will be deleted.") >> nth=3
  await page
    .locator(
      'main div:has-text("trenton15 seconds agoFirst comment which will be deleted.")'
    )
    .nth(3)
    .click();

  // Click main div:has-text("trentonnowSecond comment which will not be deleted.") >> nth=3
  await page
    .locator(
      'main div:has-text("trentonnowSecond comment which will not be deleted.")'
    )
    .nth(3)
    .click();
});
