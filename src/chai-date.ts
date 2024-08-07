/**
 * @license
 * Copyright 2024 Come Home AI, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {customElement, state} from 'lit/decorators.js';
import { ChaiTextFieldBase } from './ChaiTextFieldBase';
import {css, html} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import {classMap} from 'lit/directives/class-map.js';

/**
 * The standard form element for the requested service date.
 */
@customElement('chai-date')
export class ChaiDate extends ChaiTextFieldBase {

  @state()
  private isMobile = false;

  constructor() {
    super("date", "date", "Date", undefined, "Please enter a valid future date.", "off");
  }

  static override styles = [
    ...ChaiTextFieldBase.styles,
    css`
      .date-picker {
          display: inline-block;
          font-size: var(--chai-form-font-size);
          color: var(--chai-input-color);
          border: var(--chai-input-border);
          border-radius: var(--chai-input-corner-radius);
          box-shadow: var(--chai-input-shadow);
          padding: 0;
          margin-bottom: calc(var(--chai-form-spacing) / 2);
          min-width: 10rem;
          min-height: 2rem;
          background: #fff;
          position: relative;
          isolation: isolate;
      }

      .date-picker,
      .date-picker > * {
          cursor: text;
          font-size: var(--chai-form-font-size);
      }

      .date-picker:focus > input[type="date"],
      .date-picker:focus-within > input[type="date"] {
          color: var(--chai-input-color);
      }

      .date-picker:focus,
      .date-picker:focus-within {
          box-shadow: 0 0 0 .1rem #000;
      }

      .date-picker:has(> input[type="date"].invalid) {
          border-color: var(--chai-form-color-alert);
          border-width: 2px;
      }

      .date-picker > .placeholder::after {
          content: "Estimated Move Date";
          pointer-events: none;
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: left;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: system-ui;
          font-size: var(--chai-form-font-size);
          color: var(--chai-input-color);
          opacity: .6;
          line-height: 2rem;
          padding-left: var(--chai-form-spacing);
      }

      /* Hide the placeholder when the input:
         1. has focus (or nested focus), or
         2. has a non-empty value. */
      .date-picker:focus > .placeholder,
      .date-picker:focus-within > .placeholder,
      .date-picker > input[type="date"]:not(.empty) + .placeholder {
          display: none;
      }

      /* Hide the system input field while keeping it interactive -
         make it invisible but covering the same space as before */
      .date-picker > input[type="date"] {
          background: none;
          border: none;
          outline: none;
          color: transparent;
      }

      .date-picker > input[type="date"] {
          font-family: system-ui;
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: left;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 0;
          padding-left: calc(var(--chai-form-spacing) / 2);
          box-sizing: border-box;
      }

      /* Make the input's value visible when the input has
         a non-empty value. */
      .date-picker > input[type="date"]:not(.empty) {
          color: var(--chai-input-color) !important;
      }
  `];

  override connectedCallback() {
    super.connectedCallback();
    this.isMobile = this.detectMobile();
    console.info(`Rendering chai-date in ${this.isMobile ? 'mobile' : 'desktop'} mode`);
  }

  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  protected override firstUpdated() {
    super.firstUpdated();
    // Set the minimum date to today's date (or tomorrow's date, depending on timezone offset).
    this.input.min = new Date().toISOString().substring(0, 10);
  }

  protected override isValueValid() {
    return /\d\d\d\d-\d\d-\d\d/.test(this.value) && new Date(this.value) > new Date();
  }

  override renderInput() {
    if (this.isMobile) {
      const invalid = this.isFieldInvalid();
      const empty = this.value === "";
      return html`
        <div class="date-picker">
          <input id=${this._fieldId} type="${this._inputType}" placeholder="${ifDefined(this.placeholder)}"
                 class=${classMap({invalid: invalid, empty: empty})} @blur="${this.blurField()}"
                 autocomplete=${ifDefined(this._autocomplete)} required
                 .value="${this.value}"
                 @input="${async (e: Event) => this.updateField((e.target as HTMLInputElement).value)}">
          <div class="placeholder"></div>
        </div>
      `;
    } else {
      return super.renderInput();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chai-date': ChaiDate;
  }
}
