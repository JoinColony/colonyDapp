export { default } from './Input';
export { default as InputComponent, MaxButtonParams } from './InputComponent';

export interface InputComponentAppearance {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  align?: 'right';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent';
  size?: 'small';
}
