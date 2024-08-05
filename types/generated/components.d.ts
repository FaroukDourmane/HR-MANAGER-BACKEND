import type { Schema, Attribute } from '@strapi/strapi';

export interface UserSalary extends Schema.Component {
  collectionName: 'components_user_salaries';
  info: {
    displayName: 'salary';
    icon: 'command';
    description: '';
  };
  attributes: {
    basic: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    housing: Attribute.Float &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    transportation: Attribute.Float &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    mobile: Attribute.Float &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    other: Attribute.Float &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'user.salary': UserSalary;
    }
  }
}
