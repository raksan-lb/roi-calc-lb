import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'roi-calculator',
  styleUrl: 'roi-calculator.css',
  shadow: true,
})
export class RoiCalculator {
  @State() costPerHour = 25;
  @State() ticketsPerMonth = 1000;
  @State() timePerTicket = 20;
  @State() aiResolutionRate = 50;

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

  renderInputField(label: string, field: 'costPerHour' | 'ticketsPerMonth' | 'timePerTicket' | 'aiResolutionRate', min: number, max: number, icon: string, showSlider = true) {
    return (
      <div
        class="input-field"
        style={{
          display: 'flex',
          flexDirection: showSlider ? 'column' : 'row',
          alignItems: showSlider ? 'flex-start' : 'center',
        }}
      >
        <label
          htmlFor={field}
          style={{
            marginBottom: showSlider ? '0.5rem' : '0',
            marginRight: showSlider ? '0' : '1rem',
            width: showSlider ? 'auto' : '50%',
          }}
        >
          {label}
        </label>
        <div class="input-container" style={{ flex: '0 0 auto', width: showSlider ? '100%' : '24%' }}>
          <div class="icon-wrapper">
            <span class={`input-icon ${icon}`}></span>
          </div>
          <input id={field} type="number" value={this[field]} min={min} max={max} onInput={(event: Event) => this.handleSliderChange(field, event)} style={{ width: '100%' }} />
        </div>
        {showSlider && (
          <div class="slider-container" style={{ width: '100%' }}>
            <input
              type="range"
              min={min}
              max={max}
              value={this[field]}
              aria-label={`${label} slider`}
              onInput={(event: Event) => this.handleSliderChange(field, event)}
              style={{ '--slider-fill': `${((this[field] - min) / (max - min)) * 100}%`, 'width': '100%' }}
            />
            {this.renderSliderMarks(min, max)}
          </div>
        )}
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
            {this.renderInputField('What is your cost per hour per agent? (in US$)', 'costPerHour', 1, 200, 'dollar-icon')}

            {this.renderInputField('How many tickets do you get each month?', 'ticketsPerMonth', 1, 2000, 'ticket-icon')}

            {this.renderInputField('Time it takes to resolve each ticket (in mins)', 'timePerTicket', 1, 200, 'clock-icon')}

            {this.renderInputField('% of tickets you want AI to resolve automatically', 'aiResolutionRate', 1, 100, 'robot-icon', false)}
          </div>

          <div class="results-section">
            <div class="results-container">
              <div class="result-item">
                <div class="result-icon conversations-icon"></div>
                <div class="result-content">
                  <div class="result-label">Total Conversations:</div>
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
            <div class="button-group">
              <a href="https://apps.shopify.com/asktimmy-ai?utm_source=asktimmy_home&amp;utm_medium=asktimmy_website" target="_blank" class="button-1 w-button">
                Install the app
              </a>
              <a href="https://zcal.co/cpsaravana/60min?utm_source=asktimmy_home&amp;utm_medium=asktimmy_website" target="_blank" class="button-1 white-btn w-button">
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
