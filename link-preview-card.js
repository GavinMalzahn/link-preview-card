/**
 * Copyright 2025 GavinMalzahn
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "placeholder title";
    this.href = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.theme = ""; 
    this.loading = false;
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  };

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      href: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      theme: { type: String },
      loading: { type: Boolean, reflect : true }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      img{
        max-width: 100%;
        height: auto;
      }
      .title {
        font-size: var(--link-preview-card-title-font-size, var(--ddd-font-size-l));
        margin: var(--ddd-spacing-1) 0;
      }

      .loader {
        border: 16px solid #7cffff; /* Light grey */
        border-top: 16px solid #5202bd; /* Blue */
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: spin 1.5s ease-in-out infinite;
        animation-direction: alternate;
      }

      @keyframes spin {
        50% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `];
  }

  updated(changedProperties) {
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loading = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const json = await response.json();
      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || this.DefaultTheme();
    } 

    catch (error) {
      console.error("Error fetching metadata:", error);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = "";
    }
  }

  defaultTheme() {
    if (this.href.includes("psu.edu")) {
      return "--ddd-primary-2"
    }
    else {
      return "--ddd-primary-20";
    }
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
        ${this.loadingState
          ? html`<div class="loading-spinner"></div>`
          : html`
            ${this.image ? html`<img src="${this.image}" alt="Preview Image" />` : ''}
            <div class="content">
              <h3 class="title">${this.title}</h3>
              <p class="desc">${this.description}</p>
              <a href="${this.link}" target="_blank" class="url">Visit Site</a>
            </div>
        `}
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);