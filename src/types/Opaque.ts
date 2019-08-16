interface SourceTag {
  readonly tag: symbol;
}

declare const OpaqueTagSymbol: unique symbol;

declare class OpaqueTag<S extends SourceTag> {
  private [OpaqueTagSymbol]: S;
}

export type Opaque<T, S extends SourceTag> = T & OpaqueTag<S> | OpaqueTag<S>;
