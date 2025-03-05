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
    const askTimmyCost = 588;

    const hoursSavedPerMonth = this.ticketsPerMonth * (this.timePerTicket / 60) * (this.aiResolutionRate / 100);
    const hoursSavedPerYear = hoursSavedPerMonth * 12;
    const totalSavings = hoursSavedPerYear * this.costPerHour;
    const roi = (totalSavings / askTimmyCost) * 100;

    return { totalSavings, hoursSavedPerYear, askTimmyCost, roi };
  }

  handleSliderChange(field: 'costPerHour' | 'ticketsPerMonth' | 'timePerTicket' | 'aiResolutionRate', event: Event) {
    const target = event.target as HTMLInputElement;
    let newValue = Number(target.value);

    // Define the min and max values for each field
    const limits = {
      costPerHour: { min: 1, max: 200 },
      ticketsPerMonth: { min: 1, max: 2000 },
      timePerTicket: { min: 1, max: 200 },
      aiResolutionRate: { min: 1, max: 100 },
    };

    // Check if the new value exceeds the max limit
    if (newValue > limits[field].max) {
      newValue = limits[field].max; // Set to max if exceeded
      target.value = newValue.toString(); // Update the input field
    } else if (newValue < limits[field].min) {
      newValue = limits[field].min; // Set to min if below
      target.value = newValue.toString(); // Update the input field
    }

    this[field] = newValue;

    // Update the slider fill
    this.updateSliderFill(target);
  }

  updateSliderFill(slider: HTMLInputElement) {
    const min = Number(slider.min) || 1;
    const max = Number(slider.max) || 100;
    const value = Number(slider.value);
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.setProperty('--slider-fill', `${percentage}%`);
  }

  renderInputField(label: string, field: 'costPerHour' | 'ticketsPerMonth' | 'timePerTicket' | 'aiResolutionRate', min: number, max: number, icon: string) {
    return (
      <div class="input-field">
        <label htmlFor={field}>{label}</label>
        <div class="input-container">
          <div class="icon-wrapper">
            <span class={`input-icon ${icon}`}></span>
          </div>
          <input id={field} type="number" value={this[field]} min={min} max={max} onInput={(event: Event) => this.handleSliderChange(field, event)} />
        </div>
        <div class="slider-container">
          <input
            type="range"
            min={min}
            max={max}
            value={this[field]}
            onInput={(event: Event) => this.handleSliderChange(field, event)}
            style={{ '--slider-fill': `${((this[field] - min) / (max - min)) * 100}%` }}
          />
          <div class="slider-labels">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { totalSavings, hoursSavedPerYear, askTimmyCost, roi } = this.calculateSavings();

    return (
      <div class="roi-calculator-wrapper">
        {/* <div class="calculator-header"></div> */}

        <div class="calculator-container">
          <div class="inputs-section">
            {this.renderInputField('What is the cost per hour per agent? (in US$)', 'costPerHour', 1, 200, 'dollar-icon')}

            {this.renderInputField('How many tickets do you get each month?', 'ticketsPerMonth', 1, 2000, 'ticket-icon')}

            {this.renderInputField('Time it takes to resolve each ticket (in mins)', 'timePerTicket', 1, 200, 'clock-icon')}

            {this.renderInputField('% of tickets you want AI to resolve automatically', 'aiResolutionRate', 1, 100, 'robot-icon')}
          </div>

          <div class="results-section">
            <div class="results-container">
              <div class="result-item">
                <div class="result-icon conversations-icon"></div>
                <div class="result-content">
                  <div class="result-label">Total Conversations :</div>
                  <div class="result-value">{this.ticketsPerMonth * 12}/yr</div>
                </div>
              </div>

              <div class="result-item">
                <div class="result-icon clock-icon"></div>
                <div class="result-content">
                  <div class="result-label">Hours Saved:</div>
                  <div class="result-value">{hoursSavedPerYear.toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs/yr</div>
                </div>
              </div>

              <div class="result-item">
                <div class="result-icon aov-icon"></div>
                <div class="result-content">
                  <div class="result-label">Total Savings:</div>
                  <div class="result-value">${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</div>
                </div>
              </div>

              <div class="result-item">
                <div class="result-icon asktimmy-icon"></div>
                <div class="result-content">
                  <div class="result-label">AskTimmy Cost:</div>
                  <div class="result-value">${askTimmyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</div>
                </div>
              </div>

              {/* <div class="result-item">
                <div class="result-icon subscription-icon"></div>
                <div class="result-content">
                  <div class="result-label">Annual ROI:</div>
                  <div class="result-value">{roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</div>
                </div>
              </div> */}
            </div>

            <div class="roi-highlight">
              <div class="roi-title">Annual ROI:</div>
              <div class="roi-value">{roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</div>
            </div>
            {/* 
            <div class="cta-container">
              <a href="https://apps.shopify.com/asktimmy-ai" class="cta-button" target="_blank" rel="noopener">
                Try AskTimmy
              </a>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
