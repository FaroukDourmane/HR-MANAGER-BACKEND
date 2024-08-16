import type { Schema, Attribute } from '@strapi/strapi';

export interface UserJob extends Schema.Component {
  collectionName: 'components_user_jobs';
  info: {
    displayName: 'Job';
    description: '';
  };
  attributes: {
    job_title: Attribute.String & Attribute.Required;
    department: Attribute.Relation<
      'user.job',
      'oneToOne',
      'api::department.department'
    >;
    grade: Attribute.Integer;
    hire_date: Attribute.Date & Attribute.Required;
    hire_end: Attribute.Date;
    employment_type: Attribute.Enumeration<
      ['full-time', 'part-time', 'intern', 'temporary']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'full-time'>;
    shift: Attribute.Relation<'user.job', 'oneToOne', 'api::shift.shift'>;
    country: Attribute.Relation<'user.job', 'oneToOne', 'api::country.country'>;
  };
}

export interface UserPersonal extends Schema.Component {
  collectionName: 'components_user_personals';
  info: {
    displayName: 'Personal';
    description: '';
  };
  attributes: {
    birthday: Attribute.Date;
    gender: Attribute.Enumeration<['male', 'female']>;
    picture: Attribute.Media;
    personal_email: Attribute.Email;
    mobile: Attribute.String;
    firstname: Attribute.String & Attribute.Required;
    lastname: Attribute.String & Attribute.Required;
    middlename: Attribute.String;
    nationality: Attribute.Relation<
      'user.personal',
      'oneToOne',
      'api::country.country'
    >;
  };
}

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
    currency: Attribute.Relation<
      'user.salary',
      'oneToOne',
      'api::currency.currency'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'user.job': UserJob;
      'user.personal': UserPersonal;
      'user.salary': UserSalary;
    }
  }
}
