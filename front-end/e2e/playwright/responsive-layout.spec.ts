import { expect, Page, test } from '@playwright/test';

const routes = [
  '/',
  '/categories/1',
  '/discussion',
  '/articles',
  '/signin',
  '/register',
  '/createNew',
  '/admin-message-board',
];

const viewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
];

async function expectViewportFit(page: Page, label: string): Promise<void> {
  const metrics = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
    );
    const offenders = Array.from(document.querySelectorAll('body *'))
      .map(element => {
        const rect = element.getBoundingClientRect();
        const className = typeof element.className === 'string' ? element.className : '';
        return {
          className,
          id: element.id,
          right: Math.round(rect.right),
          tagName: element.tagName.toLowerCase(),
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80),
          width: Math.round(rect.width),
        };
      })
      .filter(element => element.width > viewportWidth + 2 || element.right > viewportWidth + 2)
      .sort((a, b) => b.width - a.width)
      .slice(0, 5);
    const tallSharedHeaders = Array.from(document.querySelectorAll('.app-section-header, .app-list-header'))
      .map(element => {
        const rect = element.getBoundingClientRect();
        return {
          className: typeof element.className === 'string' ? element.className : '',
          height: Math.round(rect.height),
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80),
        };
      })
      .filter(element => element.height > 96);

    return { documentWidth, offenders, tallSharedHeaders, viewportWidth };
  });

  expect(
    metrics.documentWidth,
    `${label} overflows viewport. Offenders: ${JSON.stringify(metrics.offenders)}`,
  ).toBeLessThanOrEqual(metrics.viewportWidth + 2);
  expect(
    metrics.tallSharedHeaders,
    `${label} has oversized shared headers.`,
  ).toEqual([]);
}

async function closeOpenOverlay(page: Page): Promise<void> {
  const confirmButton = page.locator('app-text-dialog button', { hasText: '确认' });
  if (await confirmButton.count()) {
    await confirmButton.click();
    await expect(page.locator('app-text-dialog')).toHaveCount(0);
    return;
  }

  const cancelButton = page.locator('button[mat-dialog-close], app-create-thread button', { hasText: /取消|关闭/ });
  if (await cancelButton.count()) {
    await cancelButton.first().click();
    return;
  }

  await page.keyboard.press('Escape');
}

async function gotoFirstPackageDetail(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('app-root').waitFor({ state: 'visible' });

  const packageCards = page.locator('app-package-card');
  test.skip(await packageCards.count() === 0, 'Package detail layout requires at least one seeded package.');

  const firstPackageCard = packageCards.first();
  await expect(firstPackageCard).toBeVisible();
  await firstPackageCard.click();
  await expect(page).toHaveURL(/\/categories\/\d+\/packages\/\d+/);
  await page.locator('app-root').waitFor({ state: 'visible' });
}

async function gotoFirstThreadDetail(page: Page): Promise<void> {
  await page.goto('/discussion');
  await page.locator('app-root').waitFor({ state: 'visible' });

  const threadCards = page.locator('app-thread-card');
  test.skip(await threadCards.count() === 0, 'Thread detail layout requires at least one seeded thread.');

  const firstThreadLink = threadCards.locator('.thread-title').first();
  await expect(firstThreadLink).toBeVisible();
  await firstThreadLink.click();
  await expect(page).toHaveURL(/\/threads\/\d+/);
  await page.locator('app-root').waitFor({ state: 'visible' });
}

test.describe('responsive layout', () => {
  for (const viewport of viewports) {
    test(`public routes do not create document-level horizontal overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const route of routes) {
        await page.goto(route);
        await page.locator('app-root').waitFor({ state: 'visible' });
        await expectViewportFit(page, `${route} on ${viewport.name}`);
      }

      await gotoFirstPackageDetail(page);
      await expectViewportFit(page, `first package detail on ${viewport.name}`);

      await gotoFirstThreadDetail(page);
      await expectViewportFit(page, `first thread detail on ${viewport.name}`);
    });
  }

  test('discussion thread cards keep clear desktop and phone layouts', async ({ page }) => {
    await page.setViewportSize({ width: 1006, height: 844 });
    await page.goto('/discussion');
    await page.locator('app-root').waitFor({ state: 'visible' });
    await expectViewportFit(page, 'discussion desktop thread cards');

    const threadCards = page.locator('app-thread-card');
    test.skip(await threadCards.count() === 0, 'Discussion card layout requires at least one seeded thread.');

    const firstThreadCard = threadCards.locator('.thread-row').first();
    await expect(firstThreadCard).toBeVisible();

    const desktopMetrics = await firstThreadCard.evaluate(card => {
      const cardRect = card.getBoundingClientRect();
      const titleRect = card.querySelector('.thread-title')?.getBoundingClientRect();
      const sideRect = card.querySelector('.thread-side')?.getBoundingClientRect();

      return {
        cardHeight: Math.round(cardRect.height),
        sideLeft: sideRect ? Math.round(sideRect.left) : null,
        titleRight: titleRect ? Math.round(titleRect.right) : null,
      };
    });

    expect(desktopMetrics.cardHeight).toBeGreaterThanOrEqual(68);
    expect(desktopMetrics.cardHeight).toBeLessThanOrEqual(96);
    expect(desktopMetrics.sideLeft).toBeGreaterThan(desktopMetrics.titleRight ?? 0);

    await page.setViewportSize({ width: 390, height: 844 });
    await expectViewportFit(page, 'discussion phone thread cards');

    const phoneMetrics = await firstThreadCard.evaluate(card => {
      const cardRect = card.getBoundingClientRect();
      const titleRect = card.querySelector('.thread-title')?.getBoundingClientRect();
      const sideRect = card.querySelector('.thread-side')?.getBoundingClientRect();

      return {
        cardRight: Math.round(cardRect.right),
        sideTop: sideRect ? Math.round(sideRect.top) : null,
        titleBottom: titleRect ? Math.round(titleRect.bottom) : null,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(phoneMetrics.cardRight).toBeLessThanOrEqual(phoneMetrics.viewportWidth);
    expect(phoneMetrics.sideTop).toBeGreaterThan(phoneMetrics.titleBottom ?? 0);
  });

  test('admin workspace stays dense and usable on phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin-message-board');
    await page.locator('app-root').waitFor({ state: 'visible' });
    await expectViewportFit(page, 'admin workspace phone state');

    const adminMetrics = await page.evaluate(() => {
      const metricCards = Array.from(document.querySelectorAll('.metric-card'))
        .slice(0, 6)
        .map(card => {
          const rect = card.getBoundingClientRect();
          return {
            height: Math.round(rect.height),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        });
      const panelHeaders = Array.from(document.querySelectorAll('.panel-header'))
        .map(header => Math.round(header.getBoundingClientRect().height));
      const reviewItem = document.querySelector('.review-item')?.getBoundingClientRect();
      const eventCard = document.querySelector('.event-card')?.getBoundingClientRect();
      const visibleUserTexts = Array.from(document.querySelectorAll('.user-row .user-text'))
        .map(element => {
          const rect = element.getBoundingClientRect();
          return {
            display: getComputedStyle(element).display,
            text: (element.textContent ?? '').trim(),
            width: Math.round(rect.width),
          };
        });

      return {
        eventRight: eventCard ? Math.round(eventCard.right) : null,
        metricCards,
        panelHeaderMaxHeight: Math.max(0, ...panelHeaders),
        reviewItemRight: reviewItem ? Math.round(reviewItem.right) : null,
        visibleUserTexts,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(adminMetrics.metricCards.length).toBeGreaterThan(0);
    expect(Math.max(...adminMetrics.metricCards.map(card => card.height))).toBeLessThanOrEqual(112);
    expect(Math.max(...adminMetrics.metricCards.map(card => card.right))).toBeLessThanOrEqual(adminMetrics.viewportWidth);
    expect(adminMetrics.panelHeaderMaxHeight).toBeLessThanOrEqual(76);
    if (adminMetrics.reviewItemRight !== null) {
      expect(adminMetrics.reviewItemRight).toBeLessThanOrEqual(adminMetrics.viewportWidth);
    }
    if (adminMetrics.eventRight !== null) {
      expect(adminMetrics.eventRight).toBeLessThanOrEqual(adminMetrics.viewportWidth);
    }
    if (adminMetrics.visibleUserTexts.length > 0) {
      expect(adminMetrics.visibleUserTexts.every(user => user.display !== 'none' && user.width > 0 && user.text.length > 0)).toBe(true);
    }
  });

  test('package discussion dialog fits phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFirstPackageDetail(page);

    const versionHeaderMetrics = await page.locator('app-version-panel .head').evaluate(header => {
      const headerRect = header.getBoundingClientRect();
      const tabHeaderRect = header.parentElement?.querySelector('.mat-mdc-tab-header')?.getBoundingClientRect();

      return {
        headerHeight: Math.round(headerRect.height),
        gapToTabs: tabHeaderRect ? Math.round(tabHeaderRect.top - headerRect.bottom) : null,
      };
    });

    expect(versionHeaderMetrics.headerHeight).toBeLessThanOrEqual(64);
    expect(versionHeaderMetrics.gapToTabs).toBeLessThanOrEqual(2);

    const createThreadButton = page.locator('.create-thread-button');
    await expect(createThreadButton).toContainText('新帖子');
    await expect(createThreadButton).toBeVisible();

    const buttonMetrics = await createThreadButton.evaluate(button => {
      const buttonRect = button.getBoundingClientRect();
      const headerRect = button.closest('.caption')?.getBoundingClientRect();

      return {
        buttonRight: Math.round(buttonRect.right),
        buttonWidth: Math.round(buttonRect.width),
        headerRight: headerRect ? Math.round(headerRect.right) : null,
      };
    });

    expect(buttonMetrics.buttonWidth).toBeGreaterThanOrEqual(88);
    expect(buttonMetrics.buttonRight).toBeLessThanOrEqual(buttonMetrics.headerRight ?? 390);

    await createThreadButton.click();
    await expect(page.getByRole('heading', { name: '新帖子' })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const dialog = document.querySelector('.thread-dialog');
      const dialogRect = dialog?.getBoundingClientRect();
      const surface = document.querySelector('.mat-mdc-dialog-surface');
      const surfaceRect = surface?.getBoundingClientRect();

      return {
        dialogRight: dialogRect ? Math.round(dialogRect.right) : null,
        dialogWidth: dialogRect ? Math.round(dialogRect.width) : null,
        documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        surfaceRight: surfaceRect ? Math.round(surfaceRect.right) : null,
        surfaceWidth: surfaceRect ? Math.round(surfaceRect.width) : null,
        viewportWidth,
      };
    });

    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 2);
    expect(metrics.surfaceWidth).toBeLessThanOrEqual(metrics.viewportWidth - 8);
    expect(metrics.surfaceRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.dialogWidth).toBeLessThanOrEqual(metrics.viewportWidth - 8);
    expect(metrics.dialogRight).toBeLessThanOrEqual(metrics.viewportWidth);
  });

  test('package changelog dialog fits phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFirstPackageDetail(page);

    const changelogButtons = page.getByRole('button', { name: /更新日志/ });
    test.skip(await changelogButtons.count() === 0, 'Package changelog dialog layout requires at least one seeded changelog.');

    await changelogButtons.first().click();
    await expect(page.getByRole('heading', { name: '更新日志' })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const mainRect = document.querySelector('app-text-dialog .main')?.getBoundingClientRect();
      const editorRect = document.querySelector('app-text-dialog .dialog-editor')?.getBoundingClientRect();
      const confirmRect = Array.from(document.querySelectorAll('app-text-dialog button'))
        .find(button => button.textContent?.includes('确认'))
        ?.getBoundingClientRect();

      return {
        confirmRight: confirmRect ? Math.round(confirmRect.right) : null,
        documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        editorRight: editorRect ? Math.round(editorRect.right) : null,
        mainRight: mainRect ? Math.round(mainRect.right) : null,
        mainWidth: mainRect ? Math.round(mainRect.width) : null,
        viewportWidth,
      };
    });

    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 2);
    expect(metrics.mainWidth).toBeLessThanOrEqual(metrics.viewportWidth - 8);
    expect(metrics.mainRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.editorRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.confirmRight).toBeLessThanOrEqual(metrics.viewportWidth);
  });

  test('package detail safe interactions fit phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFirstPackageDetail(page);
    await expectViewportFit(page, 'package detail initial phone state');

    const tabs = page.locator('app-version-panel .mat-mdc-tab:not(.mat-mdc-tab-disabled)');
    const tabCount = await tabs.count();
    for (let index = 0; index < tabCount; index += 1) {
      await tabs.nth(index).click();
      await expectViewportFit(page, `package detail tab ${index + 1}`);
    }

    const changelogButtons = page.getByRole('button', { name: /更新日志/ });
    const changelogCount = await changelogButtons.count();
    for (let index = 0; index < changelogCount; index += 1) {
      await changelogButtons.nth(index).click();
      await expect(page.getByRole('heading', { name: '更新日志' })).toBeVisible();
      await expectViewportFit(page, `package changelog dialog ${index + 1}`);
      await closeOpenOverlay(page);
    }

    const versionLogButtons = page.locator('.version-log-button');
    const versionLogCount = await versionLogButtons.count();
    for (let index = 0; index < versionLogCount; index += 1) {
      await versionLogButtons.nth(index).click();
      await expect(page.getByRole('heading', { name: '更新日志' })).toBeVisible();
      await expectViewportFit(page, `history changelog dialog ${index + 1}`);
      await closeOpenOverlay(page);
    }

    await page.locator('.create-thread-button').click();
    await expect(page.getByRole('heading', { name: '新帖子' })).toBeVisible();
    await expectViewportFit(page, 'create thread dialog phone state');
    await closeOpenOverlay(page);
  });

  test('thread detail footer controls do not overlap on phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFirstThreadDetail(page);
    await expectViewportFit(page, 'thread detail phone state');
    await expect(page.getByText('获取资源信息失败')).toHaveCount(0);

    const footerMetrics = await page.locator('.thread-footer').evaluate(footer => {
      const footerRect = footer.getBoundingClientRect();
      const tagsRect = footer.querySelector('.thread-tags')?.getBoundingClientRect();
      const feedbackRect = footer.querySelector('app-feedback-card')?.getBoundingClientRect();

      return {
        feedbackTop: feedbackRect ? Math.round(feedbackRect.top) : null,
        feedbackWidth: feedbackRect ? Math.round(feedbackRect.width) : null,
        footerBottom: Math.round(footerRect.bottom),
        footerRight: Math.round(footerRect.right),
        tagsBottom: tagsRect ? Math.round(tagsRect.bottom) : null,
        tagsRight: tagsRect ? Math.round(tagsRect.right) : null,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(footerMetrics.footerRight).toBeLessThanOrEqual(footerMetrics.viewportWidth);
    expect(footerMetrics.tagsRight).toBeLessThanOrEqual(footerMetrics.footerRight);
    expect(footerMetrics.feedbackTop).toBeGreaterThanOrEqual(footerMetrics.tagsBottom ?? 0);
    expect(footerMetrics.feedbackWidth).toBeLessThanOrEqual(180);
    expect(footerMetrics.footerBottom).toBeGreaterThan(footerMetrics.feedbackTop ?? 0);
  });

  test('thread detail tag controls do not block text on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1006, height: 844 });
    await gotoFirstThreadDetail(page);
    await expectViewportFit(page, 'thread detail desktop footer controls');
    await expect(page.getByPlaceholder('输入标签后按回车')).toHaveCount(0);

    const footerMetrics = await page.locator('.thread-footer').evaluate(footer => {
      const footerRect = footer.getBoundingClientRect();
      const fieldRect = footer.querySelector('.tag-list')?.getBoundingClientRect();
      const readonlyTagsRect = footer.querySelector('.readonly-tag-list, .readonly-tag-empty')?.getBoundingClientRect();
      const feedbackRect = footer.querySelector('app-feedback-card')?.getBoundingClientRect();
      const contentRect = footer.closest('.thread-content-card')?.getBoundingClientRect();
      const tagsRect = footer.querySelector('.thread-tags')?.getBoundingClientRect();

      return {
        contentRight: contentRect ? Math.round(contentRect.right) : null,
        feedbackBottom: feedbackRect ? Math.round(feedbackRect.bottom) : null,
        feedbackLeft: feedbackRect ? Math.round(feedbackRect.left) : null,
        feedbackRight: feedbackRect ? Math.round(feedbackRect.right) : null,
        feedbackTop: feedbackRect ? Math.round(feedbackRect.top) : null,
        fieldLeft: fieldRect ? Math.round(fieldRect.left) : null,
        fieldRight: fieldRect ? Math.round(fieldRect.right) : null,
        fieldWidth: fieldRect ? Math.round(fieldRect.width) : null,
        footerHeight: Math.round(footerRect.height),
        readonlyTagsRight: readonlyTagsRect ? Math.round(readonlyTagsRect.right) : null,
        readonlyTagsWidth: readonlyTagsRect ? Math.round(readonlyTagsRect.width) : null,
        tagsBottom: tagsRect ? Math.round(tagsRect.bottom) : null,
        tagsRight: tagsRect ? Math.round(tagsRect.right) : null,
        tagsTop: tagsRect ? Math.round(tagsRect.top) : null,
      };
    });

    expect(footerMetrics.footerHeight).toBeLessThanOrEqual(60);
    expect(footerMetrics.fieldWidth ?? footerMetrics.readonlyTagsWidth).toBeLessThanOrEqual(460);
    expect(footerMetrics.tagsRight).toBeLessThan(footerMetrics.feedbackLeft ?? 0);
    expect(footerMetrics.readonlyTagsRight ?? footerMetrics.fieldRight).toBeLessThan(footerMetrics.feedbackLeft ?? 0);
    expect(Math.abs((footerMetrics.tagsTop ?? 0) - (footerMetrics.feedbackTop ?? 0))).toBeLessThanOrEqual(12);
    expect(Math.abs((footerMetrics.tagsBottom ?? 0) - (footerMetrics.feedbackBottom ?? 0))).toBeLessThanOrEqual(12);
    expect(footerMetrics.feedbackRight).toBeLessThanOrEqual(footerMetrics.contentRight ?? 1006);
  });

  test('mobile drawer keeps clear spacing below the fixed header', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFirstThreadDetail(page);

    await page.getByRole('button', { name: '打开导航' }).click();
    await expect(page.locator('mat-sidenav.mat-drawer-opened')).toBeVisible();
    await expectViewportFit(page, 'thread detail with mobile drawer open');

    const drawerMetrics = await page.evaluate(() => {
      const drawerRect = document.querySelector('mat-sidenav')?.getBoundingClientRect();
      const createRect = document.querySelector('app-sidebar .create-button')?.getBoundingClientRect();

      return {
        createTop: createRect ? Math.round(createRect.top) : null,
        drawerRight: drawerRect ? Math.round(drawerRect.right) : null,
        drawerTop: drawerRect ? Math.round(drawerRect.top) : null,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(drawerMetrics.drawerRight).toBeLessThanOrEqual(drawerMetrics.viewportWidth);
    expect((drawerMetrics.createTop ?? 0) - (drawerMetrics.drawerTop ?? 0)).toBeGreaterThanOrEqual(22);
  });

  test('mobile drawer keeps admin navigation reachable without visible scrollbar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.addInitScript(() => {
      localStorage.setItem('userId', '1');
      localStorage.setItem('username', 'admin');
      localStorage.setItem('userType', 'ADMIN');
    });
    await page.goto('/admin-message-board');
    await page.locator('app-root').waitFor({ state: 'visible' });

    await page.getByRole('button', { name: '打开导航' }).click();
    await expect(page.locator('mat-sidenav.mat-drawer-opened')).toBeVisible();
    await expectViewportFit(page, 'compact mobile drawer open');

    const drawerMetrics = await page.evaluate(() => {
      const section = document.querySelector('app-sidebar .category-section') as HTMLElement | null;
      if (section) {
        section.scrollTop = section.scrollHeight;
      }
      const adminOption = document.querySelector('app-sidebar .admin-nav-option')?.getBoundingClientRect();
      const sectionStyle = section ? getComputedStyle(section) : null;
      const sectionRect = section?.getBoundingClientRect();

      return {
        adminBottom: adminOption ? Math.round(adminOption.bottom) : null,
        adminTop: adminOption ? Math.round(adminOption.top) : null,
        categoryBottom: sectionRect ? Math.round(sectionRect.bottom) : null,
        categoryScrollTop: section ? Math.round(section.scrollTop) : null,
        categoryScrollbarWidth: sectionStyle?.scrollbarWidth ?? null,
        categoryPaddingBottom: sectionStyle ? Number.parseFloat(sectionStyle.paddingBottom) : null,
        viewportHeight: window.innerHeight,
      };
    });

    expect(drawerMetrics.categoryScrollbarWidth).toBe('none');
    expect(drawerMetrics.categoryPaddingBottom).toBeGreaterThanOrEqual(72);
    expect(drawerMetrics.categoryScrollTop).toBeGreaterThan(0);
    expect(drawerMetrics.adminTop).not.toBeNull();
    expect(drawerMetrics.adminBottom).not.toBeNull();
    expect(drawerMetrics.adminTop).toBeGreaterThanOrEqual(0);
    expect(drawerMetrics.adminBottom).toBeLessThanOrEqual(drawerMetrics.viewportHeight - 16);
  });
});
