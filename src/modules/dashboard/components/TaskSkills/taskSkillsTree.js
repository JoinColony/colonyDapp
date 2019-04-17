/* @flow */

import type { ConsumableItem } from '~core/ItemsList/ItemsList';

const taskSkills: ConsumableItem[] = [
  {
    id: 1,
    name: 'Business Operations & Management',
  },
  {
    id: 2,
    name: 'Engineering & Technology',
  },
  {
    id: 3,
    name: 'Art & Design',
  },
  {
    id: 4,
    name: 'Science & Mathematics',
  },
  {
    id: 5,
    name: 'Strategy',
    parent: 1,
  },
  {
    id: 6,
    name: 'Operations',
    parent: 1,
  },
  {
    id: 7,
    name: 'Finance',
    parent: 1,
  },
  {
    id: 8,
    name: 'Accounting',
    parent: 1,
  },
  {
    id: 9,
    name: 'Legal',
    parent: 1,
  },
  {
    id: 10,
    name: 'Human Resources',
    parent: 1,
  },
  {
    id: 11,
    name: 'Business Development',
    parent: 1,
  },
  {
    id: 12,
    name: 'Sales',
    parent: 1,
  },
  {
    id: 13,
    name: 'Marketing & Communications',
    parent: 1,
  },
  {
    id: 14,
    name: 'Customer Service',
    parent: 1,
  },
  {
    id: 15,
    name: 'Community Management',
    parent: 1,
  },
  {
    id: 16,
    name: 'Software Engineering',
    parent: 2,
  },
  {
    id: 17,
    name: 'Product Development',
    parent: 2,
  },
  {
    id: 18,
    name: 'Research and Development',
    parent: 2,
  },
  {
    id: 19,
    name: 'Graphic Design',
    parent: 3,
  },
  {
    id: 20,
    name: 'Illustration',
    parent: 3,
  },
  {
    id: 21,
    name: 'Industrial Design',
    parent: 3,
  },
  {
    id: 22,
    name: 'Video Production',
    parent: 3,
  },
  {
    id: 23,
    name: 'Filmmaking',
    parent: 3,
  },
  {
    id: 24,
    name: 'Photography',
    parent: 3,
  },
  {
    id: 25,
    name: 'Motion',
    parent: 3,
  },
  {
    id: 26,
    name: 'Architecture',
    parent: 3,
  },
  {
    id: 27,
    name: 'Economics',
    parent: 4,
  },
  {
    id: 28,
    name: 'Mathematics',
    parent: 4,
  },
  {
    id: 29,
    name: 'Data Science',
    parent: 4,
  },
  {
    id: 30,
    name: 'Computer Science',
    parent: 4,
  },
  {
    id: 31,
    name: 'Recruiting',
    parent: 10,
  },
  {
    id: 32,
    name: 'Learning & Development',
    parent: 10,
  },
  {
    id: 33,
    name: 'Partnerships',
    parent: 11,
  },
  {
    id: 34,
    name: 'Social Media',
    parent: 13,
  },
  {
    id: 35,
    name: 'Email Marketing',
    parent: 13,
  },
  {
    id: 36,
    name: 'Content Marketing',
    parent: 13,
  },
  {
    id: 37,
    name: 'Content Creation',
    parent: 13,
  },
  {
    id: 38,
    name: 'SEO',
    parent: 13,
  },
  {
    id: 39,
    name: 'Advertising',
    parent: 13,
  },
  {
    id: 40,
    name: 'Copywriting',
    parent: 13,
  },
  {
    id: 41,
    name: 'Communications',
    parent: 13,
  },
  {
    id: 42,
    name: 'Frontend Development',
    parent: 16,
  },
  {
    id: 43,
    name: 'Backend Development',
    parent: 16,
  },
  {
    id: 44,
    name: 'Mobile Development',
    parent: 16,
  },
  {
    id: 45,
    name: 'Web Development',
    parent: 16,
  },
  {
    id: 46,
    name: 'DevOps',
    parent: 16,
  },
  {
    id: 47,
    name: 'Quality Assurance',
    parent: 16,
  },
  {
    id: 48,
    name: 'Developer Relations',
    parent: 16,
  },
  {
    id: 49,
    name: 'Programming, Scripting, and Markup Languages',
    parent: 16,
  },
  {
    id: 50,
    name: 'Databases',
    parent: 16,
  },
  {
    id: 51,
    name: 'Tools, Frameworks, and Libraries',
    parent: 16,
  },
  {
    id: 52,
    name: 'Product Management',
    parent: 17,
  },
  {
    id: 53,
    name: 'Product Marketing',
    parent: 17,
  },
  {
    id: 54,
    name: 'Product Design',
    parent: 17,
  },
  {
    id: 55,
    name: 'Data Analytics',
    parent: 17,
  },
  {
    id: 56,
    name: 'Cryptography',
    parent: 28,
  },
  {
    id: 57,
    name: 'Statistics',
    parent: 28,
  },
  {
    id: 58,
    name: 'HTML',
    parent: 49,
  },
  {
    id: 59,
    name: 'CSS',
    parent: 49,
  },
  {
    id: 60,
    name: 'Javascript',
    parent: 49,
  },
  {
    id: 61,
    name: 'Java',
    parent: 49,
  },
  {
    id: 62,
    name: 'Python',
    parent: 49,
  },
  {
    id: 63,
    name: 'C++',
    parent: 49,
  },
  {
    id: 64,
    name: 'C',
    parent: 49,
  },
  {
    id: 65,
    name: 'C#',
    parent: 49,
  },
  {
    id: 66,
    name: 'PHP',
    parent: 49,
  },
  {
    id: 67,
    name: 'Typescript',
    parent: 49,
  },
  {
    id: 68,
    name: 'Shell',
    parent: 49,
  },
  {
    id: 69,
    name: 'Ruby',
    parent: 49,
  },
  {
    id: 70,
    name: 'Solidity',
    parent: 49,
  },
  {
    id: 71,
    name: 'Swift',
    parent: 49,
  },
  {
    id: 72,
    name: 'Objective-C',
    parent: 49,
  },
  {
    id: 73,
    name: 'Go',
    parent: 49,
  },
  {
    id: 74,
    name: 'MongoDB',
    parent: 50,
  },
  {
    id: 75,
    name: 'MySQL',
    parent: 50,
  },
  {
    id: 76,
    name: 'SQL Server',
    parent: 50,
  },
  {
    id: 77,
    name: 'SQLLite',
    parent: 50,
  },
  {
    id: 78,
    name: 'Redis',
    parent: 50,
  },
  {
    id: 79,
    name: 'Elasticsearch',
    parent: 50,
  },
  {
    id: 80,
    name: 'OrbitDB',
    parent: 50,
  },
  {
    id: 81,
    name: 'MariaDB',
    parent: 50,
  },
  {
    id: 82,
    name: 'PostgreSQL',
    parent: 50,
  },
  {
    id: 83,
    name: 'Node.js',
    parent: 51,
  },
  {
    id: 84,
    name: 'React',
    parent: 51,
  },
  {
    id: 85,
    name: 'Angular',
    parent: 51,
  },
  {
    id: 86,
    name: 'Cordova',
    parent: 51,
  },
  {
    id: 87,
    name: 'Spring',
    parent: 51,
  },
  {
    id: 88,
    name: 'Django',
    parent: 51,
  },
  {
    id: 89,
    name: '.NET Core',
    parent: 51,
  },
  {
    id: 90,
    name: 'User Research',
    parent: 54,
  },
  {
    id: 91,
    name: 'User Experience',
    parent: 54,
  },
  {
    id: 92,
    name: 'User Interface Design',
    parent: 54,
  },
];

export default taskSkills;
