import { faker } from '@faker-js/faker';

export function generateProduct() {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      inStock: faker.datatype.boolean(),
      randomDiscount: Math.random() * 0.5, // This will be captured
      createdAt: Date.now(), // This will be captured
      tags: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => faker.commerce.productAdjective()),
      reviews: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        author: faker.person.fullName(),
        date: faker.date.past(),
      }))
    };
  }