export default function factory() {
  return {
    files: ['integration-testing/**/*.test.ts'],
    require: ['@babel/register'],
  };
}
