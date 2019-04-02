/* @flow */

import { List } from 'immutable';

import { SkillRecord } from '~immutable';

const taskSkills = List.of(
  SkillRecord({
    id: 1,
    name: 'Business Operations & Management',
  }),
  SkillRecord({
    id: 2,
    name: 'Engineering & Technology',
  }),
  SkillRecord({
    id: 3,
    name: 'Art & Design',
  }),
  SkillRecord({
    id: 4,
    name: 'Science & Mathematics',
  }),
  SkillRecord({
    id: 5,
    name: 'Strategy',
    parent: 1,
  }),
  SkillRecord({
    id: 6,
    name: 'Operations',
    parent: 1,
  }),
  SkillRecord({
    id: 7,
    name: 'Finance',
    parent: 1,
  }),
  SkillRecord({
    id: 8,
    name: 'Accounting',
    parent: 1,
  }),
  SkillRecord({
    id: 9,
    name: 'Legal',
    parent: 1,
  }),
  SkillRecord({
    id: 10,
    name: 'Human Resources',
    parent: 1,
  }),
  SkillRecord({
    id: 11,
    name: 'Business Development',
    parent: 1,
  }),
  SkillRecord({
    id: 12,
    name: 'Sales',
    parent: 1,
  }),
  SkillRecord({
    id: 13,
    name: 'Marketing & Communications',
    parent: 1,
  }),
  SkillRecord({
    id: 14,
    name: 'Customer Service',
    parent: 1,
  }),
  SkillRecord({
    id: 15,
    name: 'Community Management',
    parent: 1,
  }),
  SkillRecord({
    id: 16,
    name: 'Software Engineering',
    parent: 2,
  }),
  SkillRecord({
    id: 17,
    name: 'Product Development',
    parent: 2,
  }),
  SkillRecord({
    id: 18,
    name: 'Research and Development',
    parent: 2,
  }),
  SkillRecord({
    id: 19,
    name: 'Graphic Design',
    parent: 3,
  }),
  SkillRecord({
    id: 20,
    name: 'Illustration',
    parent: 3,
  }),
  SkillRecord({
    id: 21,
    name: 'Industrial Design',
    parent: 3,
  }),
  SkillRecord({
    id: 22,
    name: 'Video Production',
    parent: 3,
  }),
  SkillRecord({
    id: 23,
    name: 'Filmmaking',
    parent: 3,
  }),
  SkillRecord({
    id: 24,
    name: 'Photography',
    parent: 3,
  }),
  SkillRecord({
    id: 25,
    name: 'Motion',
    parent: 3,
  }),
  SkillRecord({
    id: 26,
    name: 'Architecture',
    parent: 3,
  }),
  SkillRecord({
    id: 27,
    name: 'Economics',
    parent: 4,
  }),
  SkillRecord({
    id: 28,
    name: 'Mathematics',
    parent: 4,
  }),
  SkillRecord({
    id: 29,
    name: 'Data Science',
    parent: 4,
  }),
  SkillRecord({
    id: 30,
    name: 'Computer Science',
    parent: 4,
  }),
  SkillRecord({
    id: 31,
    name: 'Recruiting',
    parent: 10,
  }),
  SkillRecord({
    id: 32,
    name: 'Learning & Development',
    parent: 10,
  }),
  SkillRecord({
    id: 33,
    name: 'Partnerships',
    parent: 11,
  }),
  SkillRecord({
    id: 34,
    name: 'Social Media',
    parent: 13,
  }),
  SkillRecord({
    id: 35,
    name: 'Email Marketing',
    parent: 13,
  }),
  SkillRecord({
    id: 36,
    name: 'Content Marketing',
    parent: 13,
  }),
  SkillRecord({
    id: 37,
    name: 'Content Creation',
    parent: 13,
  }),
  SkillRecord({
    id: 38,
    name: 'SEO',
    parent: 13,
  }),
  SkillRecord({
    id: 39,
    name: 'Advertising',
    parent: 13,
  }),
  SkillRecord({
    id: 40,
    name: 'Copywriting',
    parent: 13,
  }),
  SkillRecord({
    id: 41,
    name: 'Communications',
    parent: 13,
  }),
  SkillRecord({
    id: 42,
    name: 'Frontend Development',
    parent: 16,
  }),
  SkillRecord({
    id: 43,
    name: 'Backend Development',
    parent: 16,
  }),
  SkillRecord({
    id: 44,
    name: 'Mobile Development',
    parent: 16,
  }),
  SkillRecord({
    id: 45,
    name: 'Web Development',
    parent: 16,
  }),
  SkillRecord({
    id: 46,
    name: 'DevOps',
    parent: 16,
  }),
  SkillRecord({
    id: 47,
    name: 'Quality Assurance',
    parent: 16,
  }),
  SkillRecord({
    id: 48,
    name: 'Developer Relations',
    parent: 16,
  }),
  SkillRecord({
    id: 49,
    name: 'Programming, Scripting, and Markup Languages',
    parent: 16,
  }),
  SkillRecord({
    id: 50,
    name: 'Databases',
    parent: 16,
  }),
  SkillRecord({
    id: 51,
    name: 'Tools, Frameworks, and Libraries',
    parent: 16,
  }),
  SkillRecord({
    id: 52,
    name: 'Product Management',
    parent: 17,
  }),
  SkillRecord({
    id: 53,
    name: 'Product Marketing',
    parent: 17,
  }),
  SkillRecord({
    id: 54,
    name: 'Product Design',
    parent: 17,
  }),
  SkillRecord({
    id: 55,
    name: 'Data Analytics',
    parent: 17,
  }),
  SkillRecord({
    id: 56,
    name: 'Cryptography',
    parent: 28,
  }),
  SkillRecord({
    id: 57,
    name: 'Statistics',
    parent: 28,
  }),
  SkillRecord({
    id: 58,
    name: 'HTML',
    parent: 49,
  }),
  SkillRecord({
    id: 59,
    name: 'CSS',
    parent: 49,
  }),
  SkillRecord({
    id: 60,
    name: 'Javascript',
    parent: 49,
  }),
  SkillRecord({
    id: 61,
    name: 'Java',
    parent: 49,
  }),
  SkillRecord({
    id: 62,
    name: 'Python',
    parent: 49,
  }),
  SkillRecord({
    id: 63,
    name: 'C++',
    parent: 49,
  }),
  SkillRecord({
    id: 64,
    name: 'C',
    parent: 49,
  }),
  SkillRecord({
    id: 65,
    name: 'C#',
    parent: 49,
  }),
  SkillRecord({
    id: 66,
    name: 'PHP',
    parent: 49,
  }),
  SkillRecord({
    id: 67,
    name: 'Typescript',
    parent: 49,
  }),
  SkillRecord({
    id: 68,
    name: 'Shell',
    parent: 49,
  }),
  SkillRecord({
    id: 69,
    name: 'Ruby',
    parent: 49,
  }),
  SkillRecord({
    id: 70,
    name: 'Solidity',
    parent: 49,
  }),
  SkillRecord({
    id: 71,
    name: 'Swift',
    parent: 49,
  }),
  SkillRecord({
    id: 72,
    name: 'Objective-C',
    parent: 49,
  }),
  SkillRecord({
    id: 73,
    name: 'Go',
    parent: 49,
  }),
  SkillRecord({
    id: 74,
    name: 'MongoDB',
    parent: 50,
  }),
  SkillRecord({
    id: 75,
    name: 'MySQL',
    parent: 50,
  }),
  SkillRecord({
    id: 76,
    name: 'SQL Server',
    parent: 50,
  }),
  SkillRecord({
    id: 77,
    name: 'SQLLite',
    parent: 50,
  }),
  SkillRecord({
    id: 78,
    name: 'Redis',
    parent: 50,
  }),
  SkillRecord({
    id: 79,
    name: 'Elasticsearch',
    parent: 50,
  }),
  SkillRecord({
    id: 80,
    name: 'OrbitDB',
    parent: 50,
  }),
  SkillRecord({
    id: 81,
    name: 'MariaDB',
    parent: 50,
  }),
  SkillRecord({
    id: 82,
    name: 'PostgreSQL',
    parent: 50,
  }),
  SkillRecord({
    id: 83,
    name: 'Node.js',
    parent: 51,
  }),
  SkillRecord({
    id: 84,
    name: 'React',
    parent: 51,
  }),
  SkillRecord({
    id: 85,
    name: 'Angular',
    parent: 51,
  }),
  SkillRecord({
    id: 86,
    name: 'Cordova',
    parent: 51,
  }),
  SkillRecord({
    id: 87,
    name: 'Spring',
    parent: 51,
  }),
  SkillRecord({
    id: 88,
    name: 'Django',
    parent: 51,
  }),
  SkillRecord({
    id: 89,
    name: '.NET Core',
    parent: 51,
  }),
  SkillRecord({
    id: 90,
    name: 'User Research',
    parent: 54,
  }),
  SkillRecord({
    id: 91,
    name: 'User Experience',
    parent: 54,
  }),
  SkillRecord({
    id: 92,
    name: 'User Interface Design',
    parent: 54,
  }),
);

export default taskSkills;
