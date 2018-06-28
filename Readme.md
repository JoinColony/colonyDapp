# colonyUI

This is an experiment to extract the major core components out of the colonyDapp and also create a nice style guide around them, as a reference for future developers. We expect to have more outside contributors in the future, hence I consider this worth the effort. If this works well we could think about moving all of our UI into this repo.

There are a few things missing still:

- Linting
- A proper jest test setup
- Add some main styles (including our font)
- Some tweaks around component loading (what about containers?)

We are using `react-styleguidist` to create the styleguide. This can be set up like this:

1. Install dependencies

  ```
  yarn install
  ```

2. Install npx globally, if you don't have yet (yes, it's super useful)

  ```
  yarn global install npx
  ```

3. Start the styleguide server

  ```
  npx styleguidist server
  ```
