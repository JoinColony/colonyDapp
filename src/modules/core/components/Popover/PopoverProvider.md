The PopoverProvider is used much like the DialogProvider expect that it doesn't take any extra props.

### Using `PopoverProvider` and `withPopoverControls`

The popovers which can be opened using the `withPopoverControls` HoC register themselves (`RegisteredPopover`). You wrap the whole application in the PopoverProvider and use the `withPopoverControls` HoC to open or close popovers externally.

The `withPopoverControls` HoC injects the following props:

* `openPopover(popoverName: string): void`
* `closePopover(popoverName: string): void`
* `registeredPopovers: ImmutableSet<string>`

The most important being the first two functions. These functions are used to open or close a `RegisteredPopover` with the name `popoverName` externally. See a full example in the [`RegisteredPopover`](#registeredpopover) section.
