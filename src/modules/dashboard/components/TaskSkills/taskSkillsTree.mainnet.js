/* @flow */

/*
 * Skills Tree For the Mainnet Network
 */

import type { ConsumableItem } from '~core/ItemsList/ItemsList';

const taskSkills: ConsumableItem[] = [
  {
    id: -1,
    name: 'Business Operations & Management',
  },
  {
    id: 3,
    name: 'Accounting',
    parent: -1,
  },
  {
    id: 4,
    name: 'Advertising',
    parent: -1,
  },
  {
    id: 5,
    name: 'Business Development',
    parent: -1,
  },
  {
    id: 6,
    name: 'Business Strategy',
    parent: -1,
  },
  {
    id: 7,
    name: 'Communications',
    parent: -1,
  },
  {
    id: 8,
    name: 'Community Management',
    parent: -1,
  },
  {
    id: 9,
    name: 'Content Marketing',
    parent: -1,
  },
  {
    id: 10,
    name: 'Content Creation',
    parent: -1,
  },
  {
    id: 11,
    name: 'Copywriting',
    parent: -1,
  },
  {
    id: 12,
    name: 'Customer Service',
    parent: -1,
  },
  {
    id: 13,
    name: 'Email Marketing',
    parent: -1,
  },
  {
    id: 14,
    name: 'Finance',
    parent: -1,
  },
  {
    id: 15,
    name: 'Human Resources',
    parent: -1,
  },
  {
    id: 16,
    name: 'Learning & Development',
    parent: -1,
  },
  {
    id: 17,
    name: 'Legal',
    parent: -1,
  },
  {
    id: 18,
    name: 'Marketing & Communications',
    parent: -1,
  },
  {
    id: 19,
    name: 'Operations',
    parent: -1,
  },
  {
    id: 20,
    name: 'Partnerships',
    parent: -1,
  },
  {
    id: 21,
    name: 'Recruiting',
    parent: -1,
  },
  {
    id: 22,
    name: 'Sales',
    parent: -1,
  },
  {
    id: 23,
    name: 'SEO',
    parent: -1,
  },
  {
    id: 24,
    name: 'Social Media',
    parent: -1,
  },
  {
    id: -2,
    name: 'Engineering & Technology',
  },
  {
    id: 25,
    name: 'Software Engineering',
    parent: -2,
  },
  {
    id: 26,
    name: 'Frontend Development',
    parent: -2,
  },
  {
    id: 27,
    name: 'Backend Development',
    parent: -2,
  },
  {
    id: 28,
    name: 'Mobile Development',
    parent: -2,
  },
  {
    id: 29,
    name: 'Web Development',
    parent: -2,
  },
  {
    id: 30,
    name: 'DevOps',
    parent: -2,
  },
  {
    id: 31,
    name: 'Quality Assurance',
    parent: -2,
  },
  {
    id: 32,
    name: 'Developer Relations',
    parent: -2,
  },
  {
    id: -3,
    name: 'Programming, Scripting, & Markup Languages',
  },
  {
    id: 31,
    name: 'HTML',
    parent: -3,
  },
  {
    id: 32,
    name: 'CSS',
    parent: -3,
  },
  {
    id: 33,
    name: 'Javascript',
    parent: -3,
  },
  {
    id: 34,
    name: 'Java',
    parent: -3,
  },
  {
    id: 35,
    name: 'Python',
    parent: -3,
  },
  {
    id: 36,
    name: 'C++',
    parent: -3,
  },
  {
    id: 37,
    name: 'C',
    parent: -3,
  },
  {
    id: 38,
    name: 'C#',
    parent: -3,
  },
  {
    id: 39,
    name: 'PHP',
    parent: -3,
  },
  {
    id: 40,
    name: 'Typescript',
    parent: -3,
  },
  {
    id: 41,
    name: 'Shell',
    parent: -3,
  },
  {
    id: 66,
    name: 'Solidity',
    parent: -3,
  },
  {
    id: 43,
    name: 'Ruby',
    parent: -3,
  },
  {
    id: 44,
    name: 'Swift',
    parent: -3,
  },
  {
    id: 45,
    name: 'Objective-C',
    parent: -3,
  },
  {
    id: 46,
    name: 'Go',
    parent: -3,
  },
  {
    id: -4,
    name: 'Databases',
  },
  {
    id: 47,
    name: 'MongoDB',
    parent: -4,
  },
  {
    id: 48,
    name: 'MySQL',
    parent: -4,
  },
  {
    id: 49,
    name: 'SQL Server',
    parent: -4,
  },
  {
    id: 50,
    name: 'SQLLite',
    parent: -4,
  },
  {
    id: 51,
    name: 'Redis',
    parent: -4,
  },
  {
    id: 52,
    name: 'Elasticsearch',
    parent: -4,
  },
  {
    id: 53,
    name: 'OrbitDB',
    parent: -4,
  },
  {
    id: 54,
    name: 'MariaDB',
    parent: -4,
  },
  {
    id: 55,
    name: 'PostgreSQL',
    parent: -4,
  },
  {
    id: -5,
    name: 'Tools, Frameworks, & Libraries',
  },
  {
    id: 56,
    name: 'Node.js',
    parent: -5,
  },
  {
    id: 57,
    name: 'React',
    parent: -5,
  },
  {
    id: 58,
    name: 'Angular',
    parent: -5,
  },
  {
    id: 59,
    name: 'Cordova',
    parent: -5,
  },
  {
    id: 60,
    name: 'Spring',
    parent: -5,
  },
  {
    id: 61,
    name: 'Django',
    parent: -5,
  },
  {
    id: 62,
    name: '.NET Core',
    parent: -5,
  },
  {
    id: -6,
    name: 'Product Development',
  },
  {
    id: 63,
    name: 'Product Management',
    parent: -6,
  },
  {
    id: 64,
    name: 'Product Marketing',
    parent: -6,
  },
  {
    id: 65,
    name: 'Product Design',
    parent: -6,
  },
  {
    id: 42,
    name: 'User Research',
    parent: -6,
  },
  {
    id: 67,
    name: 'User Experience',
    parent: -6,
  },
  {
    id: 68,
    name: 'User Interface Design',
    parent: -6,
  },
  {
    id: 69,
    name: 'Data Analytics',
    parent: -6,
  },
  {
    id: 70,
    name: 'Research & Development',
    parent: -6,
  },
  {
    id: -7,
    name: 'Art & Design',
  },
  {
    id: 71,
    name: 'Graphic Design',
    parent: -7,
  },
  {
    id: 72,
    name: 'Illustration',
    parent: -7,
  },
  {
    id: 73,
    name: 'Industrial Design',
    parent: -7,
  },
  {
    id: 74,
    name: 'V  ideo Production',
    parent: -7,
  },
  {
    id: 75,
    name: 'Filmmaking',
    parent: -7,
  },
  {
    id: 76,
    name: 'Photography',
    parent: -7,
  },
  {
    id: 77,
    name: 'Motion Graphics',
    parent: -7,
  },
  {
    id: 78,
    name: 'Architecture',
    parent: -7,
  },
  {
    id: -8,
    name: 'Science & Mathematics',
  },
  {
    id: 79,
    name: 'Economics',
    parent: -8,
  },
  {
    id: 80,
    name: 'Mathematics',
    parent: -8,
  },
  {
    id: 81,
    name: 'Cryptography',
    parent: -8,
  },
  {
    id: 82,
    name: 'Statistics',
    parent: -8,
  },
  {
    id: 83,
    name: 'Data Science',
    parent: -8,
  },
  {
    id: 84,
    name: 'Computer Science',
    parent: -8,
  },
];

export default taskSkills;
