require('./index.scss').toString();

import ToolboxIcon from '../assets/icon.svg';
import SettingsIcon from '../assets/settings-icon.svg';
import AlignLeftIcon from '../assets/align-left-icon.svg';
import AlignCenterIcon from '../assets/align-center-icon.svg';
import AlignRightIcon from '../assets/align-right-icon.svg';

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

    this.data = {
      relation: data.relation || '',
      meta: data.meta || '',
    };
  }

  render() {
    const container = this._make('div');

    let typeOptions = [];
    const sessionId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('session='))
      .split('=')[1];
    const auth = btoa(encoder.encode(data));

    fetch(
      'https://university-backend-develop-nuwg4.ondigitalocean.app/api/v1/quizzes/',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Add each type to the typeOptions array
        data?.results?.forEach((type) => {
          typeOptions.push(type.title);
        });
      })
      .catch((error) => {
        console.error('Error fetching types:', error);
      });

    const typeSelect = this._makeSelect(typeOptions, this.data.relation);

    container.appendChild(typeSelect);

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
