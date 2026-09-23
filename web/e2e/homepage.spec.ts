import { expect, test, type Page } from '@playwright/test';
import { site } from '../site.config';

async function fillLeadForm(page: Page) {
  const form = page.getByRole('form', { name: 'Contact David' });
  await form.getByLabel('Name', { exact: true }).fill('Test Person');
  await form.getByLabel('Email', { exact: true }).fill('test@example.com');
  await form.getByLabel('Phone', { exact: true }).fill('704-555-0100');
  await form.getByLabel("What you're looking for").fill('Two bedrooms, carpet, next month.');
  return form;
}

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('headline and both hero CTAs are visible without scrolling', async ({ page }) => {
    const vh = page.viewportSize()!.height;
    const hero = page.locator('#top');
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    for (const name of ['Book a Consultation', 'Watch My Story']) {
      const box = await hero.getByRole('link', { name }).boundingBox();
      expect(box, name).not.toBeNull();
      expect(box!.y + box!.height, name).toBeLessThanOrEqual(vh);
    }
  });

  test('intro video is the first thing after the hero', async ({ page }) => {
    const ids = await page.locator('main > *').evaluateAll((els) => els.map((e) => e.id));
    expect(ids.slice(0, 2)).toEqual(['top', 'video']);
    await expect(page.locator('#video video')).not.toHaveAttribute('autoplay', /.*/);
  });

  test('no outbound links except configured social profiles', async ({ page }) => {
    const allowed = Object.values(site.social).filter(Boolean);
    const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      const internal = href.startsWith('/') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:');
      expect(internal || allowed.includes(href), href).toBe(true);
    }
  });

  test('publishes no showroom, address, hours or map', async ({ page }) => {
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/showroom|\bhours\b|directions/i);
    await expect(page.locator('iframe')).toHaveCount(0);
  });

  test('lead form validates, then shows success', async ({ page }) => {
    const form = page.getByRole('form', { name: 'Contact David' });
    await form.getByRole('button', { name: 'Send to David' }).click();
    await expect(form.getByText('Please enter your name.')).toBeVisible();
    await fillLeadForm(page);
    await form.getByRole('button', { name: 'Send to David' }).click();
    await expect(page.getByRole('status')).toContainText('David will be in touch');
  });

  test('before/after slider responds to the keyboard', async ({ page }) => {
    const slider = page.getByRole('slider').first();
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    const start = Number(await slider.inputValue());
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue(String(start + 1));
  });

  test('brand links stay on site', async ({ page }) => {
    await page.locator('#brands').getByRole('link', { name: 'Shaw' }).click();
    await expect(page).toHaveURL(/\/brands\/shaw$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Shaw' })).toBeVisible();
  });

  test('no horizontal scroll', async ({ page }) => {
    const [scrollW, clientW] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollW).toBeLessThanOrEqual(clientW);
  });
});

test('lead form shows a retry message on failure', async ({ page }) => {
  await page.goto('/?formError=1');
  const form = await fillLeadForm(page);
  await form.getByRole('button', { name: 'Send to David' }).click();
  // Scoped: Next.js adds its own role="alert" route announcer to every page.
  await expect(page.locator('#contact').getByRole('alert')).toContainText('Please try again');
});
