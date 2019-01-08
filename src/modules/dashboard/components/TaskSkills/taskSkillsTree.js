/* @flow */

import { List } from 'immutable';

import { Skill } from '~immutable';

const taskSkills = List.of(
  Skill({
    id: 1,
    name: 'Business Operations & Management',
  }),
  Skill({
    id: 2,
    name: 'Engineering & Technology',
  }),
  Skill({
    id: 3,
    name: 'Art & Design',
  }),
  Skill({
    id: 4,
    name: 'Science & Mathematics',
  }),
  Skill({
    id: 5,
    name: 'Strategy',
    parent: 1,
  }),
  Skill({
    id: 6,
    name: 'Operations',
    parent: 1,
  }),
  Skill({
    id: 7,
    name: 'Finance',
    parent: 1,
  }),
  Skill({
    id: 8,
    name: 'Accounting',
    parent: 1,
  }),
  Skill({
    id: 9,
    name: 'Legal',
    parent: 1,
  }),
  Skill({
    id: 10,
    name: 'Human Resources',
    parent: 1,
  }),
  Skill({
    id: 11,
    name: 'Business Development',
    parent: 1,
  }),
  Skill({
    id: 12,
    name: 'Sales',
    parent: 1,
  }),
  Skill({
    id: 13,
    name: 'Marketing & Communications',
    parent: 1,
  }),
  Skill({
    id: 14,
    name: 'Customer Service',
    parent: 1,
  }),
  Skill({
    id: 15,
    name: 'Community Management',
    parent: 1,
  }),
  Skill({
    id: 16,
    name: 'Software Engineering',
    parent: 2,
  }),
  Skill({
    id: 17,
    name: 'Product Development',
    parent: 2,
  }),

  Skill({
    id: 18,
    name: 'Research and Development',
    parent: 2,
  }),
  Skill({
    id: 19,
    name: 'Graphic Design',
    parent: 3,
  }),
  Skill({
    id: 20,
    name: 'Illustration',
    parent: 3,
  }),
  Skill({
    id: 21,
    name: 'Industrial Design',
    parent: 3,
  }),
  Skill({
    id: 22,
    name: 'Video Production',
    parent: 3,
  }),
  Skill({
    id: 23,
    name: 'Filmmaking',
    parent: 3,
  }),
  Skill({
    id: 24,
    name: 'Photography',
    parent: 3,
  }),
  Skill({
    id: 25,
    name: 'Motion',
    parent: 3,
  }),
  Skill({
    id: 26,
    name: 'Architecture',
    parent: 3,
  }),
  Skill({
    id: 27,
    name: 'Economics',
    parent: 4,
  }),
  Skill({
    id: 28,
    name: 'Mathematics',
    parent: 4,
  }),
  Skill({
    id: 29,
    name: 'Data Science',
    parent: 4,
  }),
  Skill({
    id: 30,
    name: 'Computer Science',
    parent: 4,
  }),
  Skill({
    id: 31,
    name: 'Recruiting',
    parent: 10,
  }),
  Skill({
    id: 32,
    name: 'Learning & Development',
    parent: 10,
  }),
  Skill({
    id: 33,
    name: 'Partnerships',
    parent: 11,
  }),
  Skill({
    id: 34,
    name: 'Social Media',
    parent: 13,
  }),
  Skill({
    id: 35,
    name: 'Email Marketing',
    parent: 13,
  }),
  Skill({
    id: 36,
    name: 'Content Marketing',
    parent: 13,
  }),
  Skill({
    id: 37,
    name: 'Content Creation',
    parent: 13,
  }),
  Skill({
    id: 38,
    name: 'SEO',
    parent: 13,
  }),
  Skill({
    id: 39,
    name: 'Advertising',
    parent: 13,
  }),
  Skill({
    id: 40,
    name: 'Copywriting',
    parent: 13,
  }),
  Skill({
    id: 41,
    name: 'Communications',
    parent: 13,
  }),
  Skill({
    id: 42,
    name: 'Frontend Development',
    parent: 16,
  }),
  Skill({
    id: 43,
    name: 'Backend Development',
    parent: 16,
  }),
  Skill({
    id: 44,
    name: 'Mobile Development',
    parent: 16,
  }),
  Skill({
    id: 45,
    name: 'Web Development',
    parent: 16,
  }),
  Skill({
    id: 46,
    name: 'DevOps',
    parent: 16,
  }),
  Skill({
    id: 47,
    name: 'Quality Assurance',
    parent: 16,
  }),
  Skill({
    id: 48,
    name: 'Developer Relations',
    parent: 16,
  }),
  Skill({
    id: 49,
    name: 'Programming, Scripting, and Markup Languages',
    parent: 16,
  }),
  Skill({
    id: 50,
    name: 'Databases',
    parent: 16,
  }),
  Skill({
    id: 51,
    name: 'Tools, Frameworks, and Libraries',
    parent: 16,
  }),
  Skill({
    id: 52,
    name: 'Product Management',
    parent: 17,
  }),
  Skill({
    id: 53,
    name: 'Product Marketing',
    parent: 17,
  }),
  Skill({
    id: 54,
    name: 'Product Design',
    parent: 17,
  }),
  Skill({
    id: 55,
    name: 'Data Analytics',
    parent: 17,
  }),
  Skill({
    id: 56,
    name: 'Cryptography',
    parent: 28,
  }),
  Skill({
    id: 57,
    name: 'Statistics',
    parent: 28,
  }),
  Skill({
    id: 58,
    name: 'HTML',
    parent: 49,
  }),
  Skill({
    id: 59,
    name: 'CSS',
    parent: 49,
  }),
  Skill({
    id: 60,
    name: 'Javascript',
    parent: 49,
  }),
  Skill({
    id: 61,
    name: 'Java',
    parent: 49,
  }),
  Skill({
    id: 62,
    name: 'Python',
    parent: 49,
  }),
  Skill({
    id: 63,
    name: 'C++',
    parent: 49,
  }),
  Skill({
    id: 64,
    name: 'C',
    parent: 49,
  }),
  Skill({
    id: 65,
    name: 'C#',
    parent: 49,
  }),
  Skill({
    id: 66,
    name: 'PHP',
    parent: 49,
  }),
  Skill({
    id: 67,
    name: 'Typescript',
    parent: 49,
  }),
  Skill({
    id: 68,
    name: 'Shell',
    parent: 49,
  }),
  Skill({
    id: 69,
    name: 'Ruby',
    parent: 49,
  }),
  Skill({
    id: 70,
    name: 'Solidity',
    parent: 49,
  }),
  Skill({
    id: 71,
    name: 'Swift',
    parent: 49,
  }),
  Skill({
    id: 72,
    name: 'Objective-C',
    parent: 49,
  }),
  Skill({
    id: 73,
    name: 'Go',
    parent: 49,
  }),
  Skill({
    id: 74,
    name: 'MongoDB',
    parent: 50,
  }),
  Skill({
    id: 75,
    name: 'MySQL',
    parent: 50,
  }),
  Skill({
    id: 76,
    name: 'SQL Server',
    parent: 50,
  }),
  Skill({
    id: 77,
    name: 'SQLLite',
    parent: 50,
  }),
  Skill({
    id: 78,
    name: 'Redis',
    parent: 50,
  }),
  Skill({
    id: 79,
    name: 'Elasticsearch',
    parent: 50,
  }),
  Skill({
    id: 80,
    name: 'OrbitDB',
    parent: 50,
  }),
  Skill({
    id: 81,
    name: 'MariaDB',
    parent: 50,
  }),
  Skill({
    id: 82,
    name: 'PostgreSQL',
    parent: 50,
  }),
  Skill({
    id: 83,
    name: 'Node.js',
    parent: 51,
  }),
  Skill({
    id: 84,
    name: 'React',
    parent: 51,
  }),
  Skill({
    id: 85,
    name: 'Angular',
    parent: 51,
  }),
  Skill({
    id: 86,
    name: 'Cordova',
    parent: 51,
  }),
  Skill({
    id: 87,
    name: 'Spring',
    parent: 51,
  }),
  Skill({
    id: 88,
    name: 'Django',
    parent: 51,
  }),
  Skill({
    id: 89,
    name: '.NET Core',
    parent: 51,
  }),
  Skill({
    id: 90,
    name: 'User Research',
    parent: 54,
  }),
  Skill({
    id: 91,
    name: 'User Experience',
    parent: 54,
  }),
  Skill({
    id: 92,
    name: 'User Interface Design',
    parent: 54,
  }),
);

export default taskSkills;
