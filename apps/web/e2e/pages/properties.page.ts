import type { Locator, Page } from '@playwright/test';

export class PropertiesPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly propertyCards: Locator;
  readonly priceRangeTrigger: Locator;
  readonly sortTrigger: Locator;
  readonly applyFiltersButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('property-search-input');
    this.filterButton = page.getByTestId('property-filter-toggle');
    this.propertyCards = page.getByTestId('property-card');
    this.priceRangeTrigger = page.getByTestId('property-price-range-trigger');
    this.sortTrigger = page.getByTestId('property-sort-trigger');
    this.applyFiltersButton = page.getByTestId('property-filters-apply');
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

  async filterByPriceRange(rangeLabel: string) {
    await this.openFilters();
    await this.priceRangeTrigger.click();
    await this.page.getByRole('option', { name: rangeLabel }).click();
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
