import type { Locator, Page } from '@playwright/test';

export class PropertiesPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly propertyCards: Locator;
  readonly priceMinInput: Locator;
  readonly priceMaxInput: Locator;
  readonly bedroomSelect: Locator;
  readonly applyFiltersButton: Locator;
  readonly clearFiltersButton: Locator;
  readonly sortSelect: Locator;
  readonly loadMoreButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/search|rechercher/i);
    this.filterButton = page.getByRole('button', { name: /filter/i });
    this.propertyCards = page.locator('[data-testid="property-card"]');
    this.priceMinInput = page.getByLabel(/min|minimum/i);
    this.priceMaxInput = page.getByLabel(/max|maximum/i);
    this.bedroomSelect = page.getByLabel(/bedroom|chambre/i);
    this.applyFiltersButton = page.getByRole('button', { name: /apply|appliquer/i });
    this.clearFiltersButton = page.getByRole('button', { name: /clear|effacer/i });
    this.sortSelect = page.getByRole('combobox', { name: /sort|trier/i });
    this.loadMoreButton = page.getByRole('button', { name: /load more|charger plus/i });
    this.noResultsMessage = page.getByText(/no results|aucun résultat/i);
  }

  async goto() {
    await this.page.goto('/properties');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async openFilters() {
    await this.filterButton.click();
  }

  async filterByPrice(min?: number, max?: number) {
    await this.openFilters();
    if (min) await this.priceMinInput.fill(min.toString());
    if (max) await this.priceMaxInput.fill(max.toString());
    await this.applyFiltersButton.click();
  }

  async getPropertyCount(): Promise<number> {
    return await this.propertyCards.count();
  }

  async clickProperty(index: number) {
    await this.propertyCards.nth(index).click();
  }

  async waitForProperties() {
    await this.page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
  }
}
