export default function factory() {
  return {
    files: ['integration-testing/*.test.ts'],
    compileEnhancements: false,
    extensions: ['ts'],
    require: ['ts-node/register', 'tsconfig-paths/register'],
  };
}
