require('./index.scss').toString();

import ToolboxIcon from '../assets/icon.svg';

export default class EditorJSRelation {
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Relation',
    };
  }

  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return 'Type here...';
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.typeOptions = [];

    this.getOptions();

    this.data = {
      relation: data.relation || '',
      meta: data.meta || '',
    };
  }

  async getOptions() {
    const username = 'itsmeskm99@gmail.com';
    const password = 'Testing123#';

    try {
      const response = await fetch(
        'https://university-backend-develop-nuwg4.ondigitalocean.app/api/v1/quizzes/',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + window.btoa(username + ':' + password),
          },
        }
      );
      const data = await response.json();

      const options = data.results.map((item) => item.slug);
      this.typeOptions = options;

      // Re-render the select element with the updated options
      const typeSelect = this._makeSelect(this.typeOptions, this.data.relation);
      const container = document.getElementById('skm-select-outer-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(typeSelect);
      }
    } catch (error) {
      console.error('Error getting options:', error);
    }
  }

  render() {
    const container = this._make('div', null, {
      id: 'skm-select-outer-container',
    });

    container.textContent = 'Loading...';

    return container;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  _makeSelect(options, selectedOption) {
    const select = this._make('select', null, {
      id: 'skm-select-wrapper',
    });

    options.forEach((option) => {
      const optionElement = this._make('option');
      optionElement.value = option;
      optionElement.text = option;
      if (option === selectedOption) {
        optionElement.selected = true;
      }
      select.appendChild(optionElement);
    });

    return select;
  }

  save(blockContent) {
    const typeSelect = blockContent.querySelector('select');
    const type = typeSelect.value;

    return Object.assign(this.data, {
      relation: type,
      meta: {},
    });
  }

  static get sanitize() {
    return {
      relation: {},
      meta: {},
    };
  }
}
