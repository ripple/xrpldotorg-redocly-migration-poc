import { Schema } from '@markdoc/markdoc';

export const sub: Schema = {
  attributes: {
    color: {
      type: 'String'
    }
  },
  render: 'Sub' // please make sure to export it in components.ts
};


// usage:
// Some markdown **test**, and sub text here: {% sub %} small {% /sub %}.