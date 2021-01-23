import React from 'react';

import styles from './ColorTag.css';

export enum Color {
  LightPink,
  Pink,
  Black,
  EmeraldGreen,
  Blue,
  Yellow,
  Red,
  Green,
  Periwinkle,
  Gold,
  Aqua,
  BlueGrey,
  Purple,
  Orange,
  Magenta,
  PurpleGrey,
}

const hexMap: Record<Color, string> = {
  [Color.Pink]: '#F5416E',
  [Color.Black]: '#00284B',
  [Color.LightPink]: '#FFBBDC',
  [Color.EmeraldGreen]: '#19A582',
  [Color.Blue]: '#4B9AD6',
  [Color.Yellow]: '#F3D166',
  [Color.Red]: '#E2506F',
  [Color.Green]: '#4DA284',
  [Color.Periwinkle]: '#4B6AD6',
  [Color.Gold]: '#F3AA66',
  [Color.Aqua]: '#50D0E2',
  [Color.BlueGrey]: '#4D79A2',
  [Color.Purple]: '#564BD6',
  [Color.Orange]: '#F37F66',
  [Color.Magenta]: '#BC50E2',
  [Color.PurpleGrey]: '#4D5BA2',
};

interface Props {
  color: Color;
}

const displayName = 'ColorTag';

const ColorTag = ({ color }: Props) => (
  <div className={styles.main}>
    <div className={styles.color} style={{ backgroundColor: hexMap[color] }} />
  </div>
);

ColorTag.displayName = displayName;

export default ColorTag;
