/* @flow */

/*
 * Skills Tree For the Goerli Network
 */

import type { ConsumableItem } from '~core/ItemsList/ItemsList';

const taskSkills: ConsumableItem[] = [
  {
    id: -1,
    name: 'Business Operations & Management',
  },
  {
    id: 6,
    name: 'Accounting',
    parent: -1,
  },
  {
    id: 7,
    name: 'Advertising',
    parent: -1,
  },
  {
    id: 8,
    name: 'Business Development',
    parent: -1,
  },
  {
    id: 9,
    name: 'Business Strategy',
    parent: -1,
  },
  {
    id: 10,
    name: 'Communications',
    parent: -1,
  },
  {
    id: 30,
    name: 'Community Management',
    parent: -1,
  },
  {
    id: 31,
    name: 'Content Marketing',
    parent: -1,
  },
  {
    id: 32,
    name: 'Content Creation',
    parent: -1,
  },
  {
    id: 33,
    name: 'Copywriting',
    parent: -1,
  },
  {
    id: 34,
    name: 'Customer Service',
    parent: -1,
  },
  {
    id: 35,
    name: 'Email Marketing',
    parent: -1,
  },
  {
    id: 36,
    name: 'Finance',
    parent: -1,
  },
  {
    id: 37,
    name: 'Human Resources',
    parent: -1,
  },
  {
    id: 38,
    name: 'Learning & Development',
    parent: -1,
  },
  {
    id: 39,
    name: 'Legal',
    parent: -1,
  },
  {
    id: 40,
    name: 'Marketing & Communications',
    parent: -1,
  },
  {
    id: 41,
    name: 'Operations',
    parent: -1,
  },
  {
    id: 42,
    name: 'Partnerships',
    parent: -1,
  },
  {
    id: 43,
    name: 'Recruiting',
    parent: -1,
  },
  {
    id: 44,
    name: 'Sales',
    parent: -1,
  },
  {
    id: 45,
    name: 'SEO',
    parent: -1,
  },
  {
    id: 46,
    name: 'Social Media',
    parent: -1,
  },
  {
    id: -2,
    name: 'Engineering & Technology ',
  },
  {
    id: 47,
    name: 'Software Engineering',
    parent: -2,
  },
  {
    id: 48,
    name: 'Frontend Development',
    parent: -2,
  },
  {
    id: 49,
    name: 'Backend Development',
    parent: -2,
  },
  {
    id: 50,
    name: 'Mobile Development',
    parent: -2,
  },
  {
    id: 51,
    name: 'Web Development',
    parent: -2,
  },
  {
    id: 52,
    name: 'DevOps',
    parent: -2,
  },
  {
    id: 53,
    name: 'Quality Assurance',
    parent: -2,
  },
  {
    id: 54,
    name: 'Developer Relations',
    parent: -2,
  },
  {
    id: -3,
    name: 'Programming, Scripting, and Markup Languages',
  },
  {
    id: 55,
    name: 'HTML',
    parent: -3,
  },
  {
    id: 56,
    name: 'CSS',
    parent: -3,
  },
  {
    id: 57,
    name: 'JavaScript',
    parent: -3,
  },
  {
    id: 58,
    name: 'Java',
    parent: -3,
  },
  {
    id: 59,
    name: 'Python',
    parent: -3,
  },
  {
    id: 60,
    name: 'C++',
    parent: -3,
  },
  {
    id: 61,
    name: 'C',
    parent: -3,
  },
  {
    id: 62,
    name: 'C#',
    parent: -3,
  },
  {
    id: 63,
    name: 'PHP',
    parent: -3,
  },
  {
    id: 64,
    name: 'TypeScript',
    parent: -3,
  },
  {
    id: 65,
    name: 'Shell',
    parent: -3,
  },
  {
    id: 66,
    name: 'Solidity',
    parent: -3,
  },
  {
    id: 67,
    name: 'Ruby',
    parent: -3,
  },
  {
    id: 68,
    name: 'Swift',
    parent: -3,
  },
  {
    id: 69,
    name: 'Objective-C',
    parent: -3,
  },
  {
    id: 70,
    name: 'Go',
    parent: -3,
  },
  {
    id: -4,
    name: 'Databases',
  },
  {
    id: 71,
    name: 'MongoDB',
    parent: -4,
  },
  {
    id: 72,
    name: 'MySQL',
    parent: -4,
  },
  {
    id: 73,
    name: 'SQL Server',
    parent: -4,
  },
  {
    id: 74,
    name: 'SQLLite',
    parent: -4,
  },
  {
    id: 75,
    name: 'Redis',
    parent: -4,
  },
  {
    id: 76,
    name: 'Elasticsearch',
    parent: -4,
  },
  {
    id: 77,
    name: 'OrbitDB',
    parent: -4,
  },
  {
    id: 78,
    name: 'MariaDB',
    parent: -4,
  },
  {
    id: 79,
    name: 'PostgreSQL',
    parent: -4,
  },
  {
    id: -5,
    name: 'Tools, Frameworks, and Libraries',
  },
  {
    id: 80,
    name: 'Node.js',
    parent: -5,
  },
  {
    id: 81,
    name: 'React',
    parent: -5,
  },
  {
    id: 82,
    name: 'Angular',
    parent: -5,
  },
  {
    id: 83,
    name: 'Cordova',
    parent: -5,
  },
  {
    id: 84,
    name: 'Spring',
    parent: -5,
  },
  {
    id: 85,
    name: 'Django',
    parent: -5,
  },
  {
    id: 86,
    name: '.NET Core',
    parent: -5,
  },
  {
    id: -6,
    name: 'Product Development',
  },
  {
    id: 87,
    name: 'Product Management',
    parent: -6,
  },
  {
    id: 88,
    name: 'Product Marketing',
    parent: -6,
  },
  {
    id: 89,
    name: 'Product Design',
    parent: -6,
  },
  {
    id: 90,
    name: 'User Research',
    parent: -6,
  },
  {
    id: 91,
    name: 'User Experience',
    parent: -6,
  },
  {
    id: 92,
    name: 'User Interface Design',
    parent: -6,
  },
  {
    id: 93,
    name: 'Data Analytics',
    parent: -6,
  },
  {
    id: 94,
    name: 'Research and Development',
    parent: -6,
  },
  {
    id: -7,
    name: 'Art & Design',
  },
  {
    id: 95,
    name: 'Graphic Design',
    parent: -7,
  },
  {
    id: 96,
    name: 'Illustration',
    parent: -7,
  },
  {
    id: 97,
    name: 'Industrial Design',
    parent: -7,
  },
  {
    id: 98,
    name: 'Video Production',
    parent: -7,
  },
  {
    id: 99,
    name: 'Filmmaking',
    parent: -7,
  },
  {
    id: 100,
    name: 'Photography',
    parent: -7,
  },
  {
    id: 101,
    name: 'Motion Graphics',
    parent: -7,
  },
  {
    id: 102,
    name: 'Architecture',
    parent: -7,
  },
  {
    id: -8,
    name: 'Science & Mathematics',
  },
  {
    id: 103,
    name: 'Economics',
    parent: -8,
  },
  {
    id: 104,
    name: 'Mathematics',
    parent: -8,
  },
  {
    id: 105,
    name: 'Cryptography',
    parent: -8,
  },
  {
    id: 106,
    name: 'Statistics',
    parent: -8,
  },
  {
    id: 107,
    name: 'Data Science',
    parent: -8,
  },
  {
    id: 108,
    name: 'Computer Science',
    parent: -8,
  },
];

export default taskSkills;
