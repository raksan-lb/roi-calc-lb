import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'roi-calculator',
  styleUrl: 'roi-calculator.css',
  shadow: true,
})
export class RoiCalculator {
  @State() costPerHour: number = 25;
  @State() ticketsPerMonth: number = 1000;
  @State() timePerTicket: number = 20;
  @State() aiResolutionRate: number = 50;

  calculateSavings() {
    const askTimmyCost = 948;

    const hoursSavedPerMonth = this.ticketsPerMonth * (this.timePerTicket / 60) * (this.aiResolutionRate / 100);
    const hoursSavedPerYear = hoursSavedPerMonth * 12;
    const totalSavings = hoursSavedPerYear * this.costPerHour;
    const roi = (totalSavings / askTimmyCost) * 100;

    return { totalSavings, hoursSavedPerYear, askTimmyCost, roi };
  }

  handleSliderChange(field: 'costPerHour' | 'ticketsPerMonth' | 'timePerTicket' | 'aiResolutionRate', event: Event) {
    const target = event.target as HTMLInputElement;
    this[field] = Number(target.value);

    // Set the CSS variable for the slider background
    // target.style.setProperty('--value', `${((Number(target.value) - Number(target.min)) / (Number(target.max) - Number(target.min))) * 100}%`);
  }

  renderSliderMarks(min: number, max: number) {
    const quarter = Math.round(max / 4);
    return (
      <div class="slider-marks">
        <span>{min}</span>
        <span>{quarter}</span>
        <span>{quarter * 2}</span>
        <span>{quarter * 3}</span>
        <span>{max}</span>
      </div>
    );
  }

  render() {
    const { totalSavings, hoursSavedPerYear, askTimmyCost, roi } = this.calculateSavings();

    return (
      <div>
        <div class="calculator-container">
          <div class="controls-section">
            <div class="control-group">
              <label>What is the cost per hour per agent? (in US$)</label>
              <div class="slider-container">
                <div class="slider-wrapper">
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={this.costPerHour}
                    onInput={event => this.handleSliderChange('costPerHour', event)}
                    style={{ '--value': `${((this.costPerHour - 1) / (200 - 1)) * 100}%` }}
                  />
                  {this.renderSliderMarks(1, 200)}
                </div>
                <input type="number" min={1} max={200} value={this.costPerHour} onInput={event => this.handleSliderChange('costPerHour', event)} />
              </div>
            </div>

            <div class="control-group">
              <label>How many tickets do you get each month?</label>
              <div class="slider-container">
                <div class="slider-wrapper">
                  <input
                    type="range"
                    min={1}
                    max={2000}
                    value={this.ticketsPerMonth}
                    onInput={event => this.handleSliderChange('ticketsPerMonth', event)}
                    style={{ '--value': `${((this.ticketsPerMonth - 1) / (2000 - 1)) * 100}%` }}
                  />
                  {this.renderSliderMarks(1, 2000)}
                </div>
                <input type="number" min={1} max={2000} value={this.ticketsPerMonth} onInput={event => this.handleSliderChange('ticketsPerMonth', event)} />
              </div>
            </div>

            <div class="control-group">
              <label>Time it takes to resolve each ticket (in mins)</label>
              <div class="slider-container">
                <div class="slider-wrapper">
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={this.timePerTicket}
                    onInput={event => this.handleSliderChange('timePerTicket', event)}
                    style={{ '--value': `${((this.timePerTicket - 1) / (200 - 1)) * 100}%` }}
                  />
                  {this.renderSliderMarks(1, 200)}
                </div>
                <input type="number" min={1} max={200} value={this.timePerTicket} onInput={event => this.handleSliderChange('timePerTicket', event)} />
              </div>
            </div>

            <div class="control-group">
              <label>% of tickets you want AI to resolve automatically</label>
              <div class="slider-container">
                <div class="slider-wrapper">
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={this.aiResolutionRate}
                    onInput={event => this.handleSliderChange('aiResolutionRate', event)}
                    style={{ '--value': `${((this.aiResolutionRate - 1) / (100 - 1)) * 100}%` }}
                  />
                  {this.renderSliderMarks(1, 100)}
                </div>
                <input type="number" min={1} max={100} value={this.aiResolutionRate} onInput={event => this.handleSliderChange('aiResolutionRate', event)} />
              </div>
            </div>
          </div>

          <div class="results-section">
            <div class="results-container">
              <div class="result-item">
                <div class="result-label">Total Savings</div>
                <div class="result-value">${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</div>
              </div>

              <div class="result-item">
                <div class="result-label">Hours Saved</div>
                <div class="result-value">{hoursSavedPerYear.toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs/yr</div>
              </div>

              <div class="result-item">
                <div class="result-label">AskTimmy Cost</div>
                <div class="result-value">${askTimmyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</div>
              </div>

              <div class="result-item highlight">
                <div class="result-label">Annual ROI</div>
                <div class="roi-value">{roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</div>
              </div>

              <div class="cta-container">
                <a href="https://apps.shopify.com/asktimmy-ai" class="cta-button" target="_blank" rel="noopener">
                  Try AskTimmy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
