import { faker } from '@faker-js/faker';

export function generateUserProfile() {
    return {
      id: Math.floor(Math.random() * 1000), // This will be captured and should be consistent
      timestamp: Date.now(), // This will be captured and should be consistent
      user: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        birthDate: faker.date.birthdate(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
        },
        company: {
          name: faker.company.name(),
          jobTitle: faker.person.jobTitle(),
          department: faker.commerce.department(),
        }
      },
      preferences: {
        theme: faker.helpers.arrayElement(['light', 'dark', 'auto']),
        language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de']),
        notifications: faker.datatype.boolean(),
      },
      randomValue: Math.random(), // This will be captured
      activities: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        type: faker.helpers.arrayElement(['login', 'purchase', 'view', 'comment']),
        description: faker.lorem.sentence(),
        timestamp: faker.date.recent(),
      }))
    };
  }