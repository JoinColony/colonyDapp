/*
 * Skills Tree For the Mainnet Network
 */

const taskSkills = [
  {
    id: -1,
    name: 'Business Operations & Management',
  },
  {
    id: 9,
    name: 'Accounting',
    parent: -1,
  },
  {
    id: 10,
    name: 'Advertising',
    parent: -1,
  },
  {
    id: 11,
    name: 'Business Development',
    parent: -1,
  },
  {
    id: 12,
    name: 'Business Strategy',
    parent: -1,
  },
  {
    id: 13,
    name: 'Communications',
    parent: -1,
  },
  {
    id: 14,
    name: 'Community Management',
    parent: -1,
  },
  {
    id: 15,
    name: 'Content Marketing',
    parent: -1,
  },
  {
    id: 16,
    name: 'Content Creation',
    parent: -1,
  },
  {
    id: 17,
    name: 'Copywriting',
    parent: -1,
  },
  {
    id: 18,
    name: 'Customer Service',
    parent: -1,
  },
  {
    id: 19,
    name: 'Email Marketing',
    parent: -1,
  },
  {
    id: 20,
    name: 'Finance',
    parent: -1,
  },
  {
    id: 21,
    name: 'Human Resources',
    parent: -1,
  },
  {
    id: 22,
    name: 'Learning & Development',
    parent: -1,
  },
  {
    id: 23,
    name: 'Legal',
    parent: -1,
  },
  {
    id: 24,
    name: 'Marketing & Communications',
    parent: -1,
  },
  {
    id: 25,
    name: 'Operations',
    parent: -1,
  },
  {
    id: 26,
    name: 'Partnerships',
    parent: -1,
  },
  {
    id: 27,
    name: 'Recruiting',
    parent: -1,
  },
  {
    id: 28,
    name: 'Sales',
    parent: -1,
  },
  {
    id: 29,
    name: 'SEO',
    parent: -1,
  },
  {
    id: 30,
    name: 'Social Media',
    parent: -1,
  },
  {
    id: -2,
    name: 'Engineering & Technology',
  },
  {
    id: 31,
    name: 'Software Engineering',
    parent: -2,
  },
  {
    id: 32,
    name: 'Frontend Development',
    parent: -2,
  },
  {
    id: 33,
    name: 'Backend Development',
    parent: -2,
  },
  {
    id: 34,
    name: 'Mobile Development',
    parent: -2,
  },
  {
    id: 35,
    name: 'Web Development',
    parent: -2,
  },
  {
    id: 36,
    name: 'DevOps',
    parent: -2,
  },
  {
    id: 37,
    name: 'Quality Assurance',
    parent: -2,
  },
  {
    id: 38,
    name: 'Developer Relations',
    parent: -2,
  },
  {
    id: -3,
    name: 'Programming, Scripting, & Markup Languages',
  },
  {
    id: 39,
    name: 'HTML',
    parent: -3,
  },
  {
    id: 40,
    name: 'CSS',
    parent: -3,
  },
  {
    id: 41,
    name: 'Javascript',
    parent: -3,
  },
  {
    id: 42,
    name: 'Java',
    parent: -3,
  },
  {
    id: 43,
    name: 'Python',
    parent: -3,
  },
  {
    id: 44,
    name: 'C++',
    parent: -3,
  },
  {
    id: 45,
    name: 'C',
    parent: -3,
  },
  {
    id: 46,
    name: 'C#',
    parent: -3,
  },
  {
    id: 47,
    name: 'PHP',
    parent: -3,
  },
  {
    id: 48,
    name: 'Typescript',
    parent: -3,
  },
  {
    id: 49,
    name: 'Shell',
    parent: -3,
  },
  {
    id: 50,
    name: 'Solidity',
    parent: -3,
  },
  {
    id: 51,
    name: 'Ruby',
    parent: -3,
  },
  {
    id: 52,
    name: 'Swift',
    parent: -3,
  },
  {
    id: 53,
    name: 'Objective-C',
    parent: -3,
  },
  {
    id: 54,
    name: 'Go',
    parent: -3,
  },
  {
    id: -4,
    name: 'Databases',
  },
  {
    id: 55,
    name: 'MongoDB',
    parent: -4,
  },
  {
    id: 56,
    name: 'MySQL',
    parent: -4,
  },
  {
    id: 57,
    name: 'SQL Server',
    parent: -4,
  },
  {
    id: 58,
    name: 'SQLLite',
    parent: -4,
  },
  {
    id: 59,
    name: 'Redis',
    parent: -4,
  },
  {
    id: 60,
    name: 'Elasticsearch',
    parent: -4,
  },
  {
    id: 61,
    name: 'OrbitDB',
    parent: -4,
  },
  {
    id: 62,
    name: 'MariaDB',
    parent: -4,
  },
  {
    id: 63,
    name: 'PostgreSQL',
    parent: -4,
  },
  {
    id: -5,
    name: 'Tools, Frameworks, & Libraries',
  },
  {
    id: 64,
    name: 'Node.js',
    parent: -5,
  },
  {
    id: 65,
    name: 'React',
    parent: -5,
  },
  {
    id: 66,
    name: 'Angular',
    parent: -5,
  },
  {
    id: 67,
    name: 'Cordova',
    parent: -5,
  },
  {
    id: 68,
    name: 'Spring',
    parent: -5,
  },
  {
    id: 69,
    name: 'Django',
    parent: -5,
  },
  {
    id: 70,
    name: '.NET Core',
    parent: -5,
  },
  {
    id: -6,
    name: 'Product Development',
  },
  {
    id: 71,
    name: 'Product Management',
    parent: -6,
  },
  {
    id: 72,
    name: 'Product Marketing',
    parent: -6,
  },
  {
    id: 73,
    name: 'Product Design',
    parent: -6,
  },
  {
    id: 74,
    name: 'User Research',
    parent: -6,
  },
  {
    id: 75,
    name: 'User Experience',
    parent: -6,
  },
  {
    id: 76,
    name: 'User Interface Design',
    parent: -6,
  },
  {
    id: 77,
    name: 'Data Analytics',
    parent: -6,
  },
  {
    id: 78,
    name: 'Research & Development',
    parent: -6,
  },
  {
    id: -7,
    name: 'Art & Design',
  },
  {
    id: 79,
    name: 'Graphic Design',
    parent: -7,
  },
  {
    id: 80,
    name: 'Illustration',
    parent: -7,
  },
  {
    id: 81,
    name: 'Industrial Design',
    parent: -7,
  },
  {
    id: 82,
    name: 'Video Production',
    parent: -7,
  },
  {
    id: 83,
    name: 'Filmmaking',
    parent: -7,
  },
  {
    id: 84,
    name: 'Photography',
    parent: -7,
  },
  {
    id: 85,
    name: 'Motion Graphics',
    parent: -7,
  },
  {
    id: 86,
    name: 'Architecture',
    parent: -7,
  },
  {
    id: -8,
    name: 'Science & Mathematics',
  },
  {
    id: 87,
    name: 'Economics',
    parent: -8,
  },
  {
    id: 88,
    name: 'Mathematics',
    parent: -8,
  },
  {
    id: 89,
    name: 'Cryptography',
    parent: -8,
  },
  {
    id: 90,
    name: 'Statistics',
    parent: -8,
  },
  {
    id: 91,
    name: 'Data Science',
    parent: -8,
  },
  {
    id: 92,
    name: 'Computer Science',
    parent: -8,
  },
];

export default taskSkills;
