import test from "node:test";
import assert from "node:assert/strict";
import { GXMAIL_PLANS, GXNOTIFY_PLANS, SITE } from "./laxitechSite.ts";

test("GXMAIL_PLANS matches the published GXMail tiers", () => {
  assert.deepEqual(
    GXMAIL_PLANS.map((plan) => [
      plan.name,
      plan.billing.monthly.price,
      plan.billing.yearly.price,
      plan.maxDomains,
      plan.maxMailboxes,
      plan.sharedStorageGb,
      plan.defaultMailboxStorageGb,
      plan.maxMailboxStorageGb,
      plan.maxSmtpCredentials,
      plan.gnotifyDiscountPercent,
      plan.support,
    ]),
    [
      ["Starter", 250, 3000, 1, 15, 30, 2, 2, 5, 0, "Email"],
      ["Business", 333, 3999, 3, 20, 60, 3, 3, 15, 10, "Email + WhatsApp"],
      [
        "Business Pro",
        500,
        5999,
        5,
        null,
        200,
        5,
        null,
        20,
        20,
        "Priority email + WhatsApp",
      ],
    ],
  );

  assert.ok(
    GXMAIL_PLANS.every((plan) => plan.billing.monthly.durationDays === 30),
  );
  assert.ok(
    GXMAIL_PLANS.every((plan) => plan.billing.yearly.durationDays === 365),
  );
});

test("GXMail links use the administration and webmail applications", () => {
  assert.equal(SITE.mailSignup, "https://manage.laxitech.com/auth/register");
  assert.equal(SITE.mailPortal, "https://manage.laxitech.com/auth/login");
  assert.equal(SITE.webmail, "https://webmail.laxitech.com");
});

test("GXNOTIFY_PLANS matches the published monthly tiers and quotas", () => {
  assert.deepEqual(
    GXNOTIFY_PLANS.map((plan) => [
      plan.name,
      plan.price,
      plan.limits.projects,
      plan.limits.email,
      plan.limits.push,
      plan.limits.sms,
      plan.limits.apiKeys,
      plan.limits.templates,
      plan.support,
    ]),
    [
      ["Starter", 500, 1, 200, 100, 50, 10, 5, "Standard support"],
      [
        "Business",
        1999,
        10,
        100000,
        10000,
        500,
        20,
        50,
        "Dedicated email support",
      ],
      [
        "Business Pro",
        3999,
        50,
        300000,
        30000,
        1000,
        30,
        200,
        "Priority dedicated email support",
      ],
    ],
  );
});

test("GXNotify links use the supplied production routes", () => {
  assert.equal(SITE.notifyDashboard, "https://gxnotify.laxitech.com/dashboard");
  assert.equal(SITE.notifySignIn, "https://gxnotify.laxitech.com/sign-in");
  assert.equal(SITE.notifySignUp, "https://gxnotify.laxitech.com/sign-up");
});
