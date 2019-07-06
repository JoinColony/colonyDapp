---
name: Feature
about: Only the finest features go into our artisanal DAOs.
title: 'Example: Show activity indicator for all async activity related to transactions
  (Colony Creation Wizard)'
labels: feature
assignees: ''

---

## Specification

### Story

Example: As a *user creating a colony*, I want to *see a visual indicator of activity/loading*, so that *I know I should wait for it to finish*


### Description (optional, but useful!)

Example: During the colony creation wizard, there is an activity indicator for pending transactions, but there is no indicator of other async operations (e.g. for the DDB) in between these transactions. It's important that the indicator remains visible until all async activity is finished, because otherwise the user has no feedback that they're waiting for something to finish; they might leave the wizard or refresh the page, leading to frustration.


### Design (optional, might not be applicable)

[Figma link](https://the-link-to-the-design-on-figma)

[Image](!https://inline-image-from-figma-for-quick-reference-or-posterity)


## Implementation

### This issue is complete when...

- [ ] The activity indicator for the `TransactionStatus` component is shown during any and all async waiting
- [ ] The indicator is hidden when async waiting finishes (either successfully or unsuccessfully)
- [ ] The indicator is shown when the transaction is pending (current behaviour), given no other async waiting
- [ ] The indicator is hidden when the transaction is not pending (current behaviour), given no other async waiting


### Suggestions (optional)

* Example: It's probably a good idea to keep the transaction state separate from other async actions that relate to them; i.e. either adding an extra transaction status, or keeping the transaction as `PENDING` while other async activity finishes would probably lead to some confusion and unintended side effects. Perhaps component state would be a more suitable starting point.


### Subtasks (optional)

- [ ] Create a prop (e.g. with component state) which indicates either a transaction is pending, or async activity is in progress related to that transaction, in the context of the wizard
- [ ] Pass down a prop to the `TransactionStatus` component
- [ ] Adjust the `TransactionStatus` component such that it shows the indicator with the given prop
