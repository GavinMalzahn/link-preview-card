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
      loading: { type: Boolean, reflect : true, attribute: "loading-state" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--ddd-spacing-2);
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        max-width: 500px;
        margin: var(--ddd-spacing-2);
        
      }
      .wrapper {
        display: grid;
        grid-template-columns: 450px;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        max-width: 500px;
        box-shadow: var(--ddd-box-shadow);
        margin: var(--ddd-spacing-2);
        border: var(--ddd-border-md);
        border-radius: var(--ddd-radius-lg);
      }
      
      .title {
        font-size: var(--link-preview-card-title-font-size, var(--ddd-font-size-l));
        margin: var(--ddd-spacing-1) 0;
        padding: var(--ddd-spacing-2);
        
      }
      .image{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 400px;
        height: auto;
        padding: var(--ddd-spacing-2);
        position: relative;
      }

      img { 
        display: block; 
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        height: auto;
        border-radius: var(--ddd-radius-md);
      }

      .url {
        display: block;
        font-size: var(--link-preview-card-url-font-size, var(--ddd-font-size-s));
        margin: var(--ddd-spacing-1) 0;
        padding: var(--ddd-spacing-2);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .desc {
        display: block;
        font-size: var(--link-preview-card-desc-font-size, var(--ddd-font-size-s)); 
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: var(--ddd-spacing-1) 0;
        padding: var(--ddd-spacing-2);
      }

      .loader {
        border: 12px solid #7cffff; /* Light grey */
        border-top: 12px solid #5202bd; /* Blue */
        border-radius: --ddd-radius-rounded;
        width: 40px;
        height: 40px;
        animation: spin 1s ease-in-out infinite;
        animation-direction: alternate;
      }

      @keyframes spin {
        50% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media not screen and (min-width: 500px) and (max-width: 800px) {
        .title {
        font-size: var(--link-preview-card-title-font-size, var(--ddd-font-size-l));
        margin: var(--ddd-spacing-1) 0;
        padding: var(--ddd-spacing-2);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; 
        }
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
    this.requestUpdate();

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
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
    } 

    catch (error) {
      console.error("Error fetching metadata:", error);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = this.defaultTheme();
    }
    finally {
      this.loading = false;
    }

    await this.updateComplete;

  }

  defaultTheme() {
    if (this.href.includes("psu.edu")) {
      return "var(--ddd-primary-2)";
    }
    else {
      return "var(--ddd-primary-8)";
    }
  }

  // Lit render the HTML
  render() {

    return html`
    <div class="wrapper" style="border-color: ${this.themeColor}">
        ${this.loading ? html`<div class="loader"></div>` : html`
            <div class="content">
              <h3 class="title">${this.title}</h3>
              <a href="${this.link}" target="_blank" class="url">${this.href}</a>
              <p class="desc">${this.description}</p>
            </div>
            <div class="image">
              ${this.image ? html`<img id="preview-image" src="${this.image}" alt="" />` : ''}
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