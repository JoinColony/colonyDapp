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

test("create colony and do stuff", async ({ page }) => {
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
    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://127.0.0.1:9090/landing' }*/),
      page.locator('[data-test="claimUsernameConfirm"]').click(),
    ]);
  }

  // Now we are on the landing page

  // Click a:has-text("Create a colony")
  await page.locator('a:has-text("Create a colony")').click();
  await expect(page).toHaveURL("http://127.0.0.1:9090/create-colony");

  const displayName = getRandomTestData("displayName");
  const colonyName = getRandomTestData("colonyName");
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
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://127.0.0.1:9090/colony/fsociety' }*/),
    page.locator('[data-test="userInputConfirm"]').click(),
  ]);

  // Click text=New Action
  await page.locator("text=New Action").click();

  // Click div[role="button"]:has-text("Manage FundsThe tools you need to manage your colony’s money.")
  await page
    .locator(
      'div[role="button"]:has-text("Manage FundsThe tools you need to manage your colony’s money.")'
    )
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
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://127.0.0.1:9090/colony/fsociety/tx/0x1b04fae05feabce1eb5c4e420869e38b55a6140aa0ad80e07fe18cdb27174626' }*/),
    page.locator("text=Confirm").click(),
  ]);

  // Click nav a svg - go back
  await page.locator("nav a svg").click();
  console.log(colonyName);
  console.log(`http://127.0.0.1:9090/colony/${colonyName}`);
  await expect(page).toHaveURL(`http://127.0.0.1:9090/colony/${colonyName}`);

  // Click text=New Action
  await page.locator("text=New Action").click();

  // Click div[role="button"]:has-text("Create ExpenditureSend funds from this colony to external addresses.")
  await page
    .locator(
      'div[role="button"]:has-text("Create ExpenditureSend funds from this colony to external addresses.")'
    )
    .click();

  // Click div[role="button"]:has-text("PaymentA quick and simple payment for something already done.")
  await page
    .locator(
      'div[role="button"]:has-text("PaymentA quick and simple payment for something already done.")'
    )
    .click();

  // Click [placeholder="Search\ for\ a\ user\ or\ paste\ wallet\ address"]
  await page
    .locator(
      '[placeholder="Search\\ for\\ a\\ user\\ or\\ paste\\ wallet\\ address"]'
    )
    .click();

  // Click text=trenton
  await page.locator(`text=${rootUserName}`).click();

  // Click input[name="amount"]
  await page.locator('input[name="amount"]').click();

  // Fill input[name="amount"]
  await page.locator('input[name="amount"]').fill("1,0000");

  // Click textarea[name="annotation"]
  await page.locator('textarea[name="annotation"]').click();

  // Fill textarea[name="annotation"]
  await page.locator('textarea[name="annotation"]').fill("Initial Payment.");

  // Click text=Confirm
  page.locator("text=Confirm").click();

  // Click textarea[name="message"]
  await page.locator('textarea[name="message"]').click();

  // Fill textarea[name="message"]
  await page
    .locator('textarea[name="message"]')
    .fill("nice, is this working right?");

  // Press Enter
  await page.locator('textarea[name="message"]').press("Enter");

  // Click nav a svg
  await page.locator("nav a svg").click();

  await page.screenshot();
  await expect(page).toHaveURL(`http://127.0.0.1:9090/colony/${colonyName}`);

  // Click text=New Action
  await page.locator("text=New Action").click();

  // Click div[role="button"]:has-text("Manage TeamsNeed more structure? Need to change a team name?")
  await page
    .locator(
      'div[role="button"]:has-text("Manage TeamsNeed more structure? Need to change a team name?")'
    )
    .click();

  // Click div[role="button"]:has-text("Create new teamDomains, departments, circles: teams let you group types of activ")
  await page
    .locator(
      'div[role="button"]:has-text("Create new teamDomains, departments, circles: teams let you group types of activ")'
    )
    .click();

  // Click input[name="teamName"]
  await page.locator('input[name="teamName"]').click();

  // Fill input[name="teamName"]
  await page
    .locator('input[name="teamName"]')
    .fill(baseTestData["secondTeamName"]);

  // Click input[name="teamName"]
  await page.locator('input[name="teamName"]').click();

  // Click text=Team name9/20Select color
  await page.locator("text=Team name9/20Select color").click();

  // Click [aria-label="Select\ color"]
  await page.locator('[aria-label="Select\\ color"]').click();

  // Click #domainColor-listbox-entry-2 div >> nth=1
  await page.locator("#domainColor-listbox-entry-2 div").nth(1).click();

  // Click input[name="domainPurpose"]
  await page.locator('input[name="domainPurpose"]').click();

  // Fill input[name="domainPurpose"]
  await page
    .locator('input[name="domainPurpose"]')
    .fill("Secret Hacking Missions");

  // Click text=Confirm
  await page.locator("text=Confirm").click();
  // Click textarea[name="message"]
  await page.locator('textarea[name="message"]').click();

  // Fill textarea[name="message"]
  await page.locator('textarea[name="message"]').fill("What's up soldiers?");

  // Press Enter
  await page.locator('textarea[name="message"]').press("Enter");

  // Click nav a svg
  await page.locator("nav a svg").click();
  await expect(page).toHaveURL(`http://127.0.0.1:9090/colony/${colonyName}`);

  // Click button:has-text("9,900 ECOIN")
  await page.locator('button:has-text("9,900 ECOIN")').click();

  // Click input[name="amount"]
  await page.locator('input[name="amount"]').click();

  // Fill input[name="amount"]
  await page.locator('input[name="amount"]').fill("1000");

  // Click text=Confirm
  await page.locator("text=Confirm").click();

  // Click text=999,990,000ECOIN >> nth=0
  await page.locator("text=999,990,000ECOIN").first().click();

  // Click text=ETH0%9,900 ECOIN 0xb77D...7461 >> button >> nth=2
  await page
    .locator("text=ETH0%9,900 ECOIN 0xb77D...7461 >> button")
    .nth(2)
    .click();

  // Click text=999,990,000ECOIN >> nth=0
  await page.locator("text=999,990,000ECOIN").first().click();

  await page.screenshot({ path: "scrn.png" });
});
