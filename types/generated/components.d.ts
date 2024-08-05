import type { Schema, Attribute } from '@strapi/strapi';

export interface UserSalary extends Schema.Component {
  collectionName: 'components_user_salaries';
  info: {
    displayName: 'salary';
    icon: 'command';
  };
  attributes: {};
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'user.salary': UserSalary;
    }
  }
}
