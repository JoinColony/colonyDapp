/* @flow */

/* eslint-disable max-len */

import { List } from 'immutable';

import { Token } from '~immutable';
import type { TokenRecord } from '~types';

const mockTokens: List<TokenRecord> = List.of(
  Token({
    address: '0x0',
    id: 4,
    name: 'Golem Network Token',
    symbol: 'GNT',
    balance: 5.55,
    icon:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzAwMUQ1NyIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTIwLjQ5OSA1LjI4OGwxLjIwMyAxLjIwNC0yLjI3NyAyLjM0Yy40OC43My43MzggMS41OTEuNzM4IDIuNDc5YTQuNDQ4IDQuNDQ4IDAgMCAxLTEuMjU4IDMuMTMxIDQuMTgzIDQuMTgzIDAgMCAxLTIuMjE3IDEuMjI2djIuMDM5Yy44MzMuMTY4IDEuNjAxLjU5MiAyLjIxMyAxLjIyYTQuNDUxIDQuNDUxIDAgMCAxIDEuMjYyIDMuMTM2IDQuNDUxIDQuNDUxIDAgMCAxLTEuMjYyIDMuMTM1IDQuMjYyIDQuMjYyIDAgMCAxLTMuMDcgMS4zMDIgNC4yNCA0LjI0IDAgMCAxLTMuMDctMS4zMDIgNC40NzQgNC40NzQgMCAwIDEtMS4yNjEtMy4xMzVjMC0xLjE4LjQ0OC0yLjI5OSAxLjI1OC0zLjEzMmE0LjE4MyA0LjE4MyAwIDAgMSAyLjIxNy0xLjIyNXYtMi4wNGE0LjI3NCA0LjI3NCAwIDAgMS0yLjIxMy0xLjIyQTQuNDc0IDQuNDc0IDAgMCAxIDExLjUgMTEuMzFjMC0xLjE4LjQ0OC0yLjI5OSAxLjI2Mi0zLjEzNWE0LjI2MiA0LjI2MiAwIDAgMSAzLjA3LTEuMzAzYy44NiAwIDEuNjg3LjI2MiAyLjM5NS43NDlMMjAuNSA1LjI4OHptLTQuNjY3IDE0LjA1N2EyLjUzIDIuNTMgMCAwIDAtMS44NTcuNzkgMi43NTEgMi43NTEgMCAwIDAtLjc3NSAxLjkyOGMwIC43MjUuMjc1IDEuNDAyLjc3NSAxLjkyNy40OTUuNTA4IDEuMTU2Ljc5IDEuODU3Ljc5YTIuNTMgMi41MyAwIDAgMCAxLjg1Ni0uNzkgMi43NTEgMi43NTEgMCAwIDAgLjc3NS0xLjkyN2MwLS43MjUtLjI3NS0xLjQwMi0uNzc4LTEuOTMxYTIuNTI3IDIuNTI3IDAgMCAwLTEuODUzLS43ODd6bTEuODUzLTYuMDlhMi43NTQgMi43NTQgMCAwIDAgLjc3OC0xLjkzMSAyLjcgMi43IDAgMCAwLS43NzUtMS45MjggMi41NzggMi41NzggMCAwIDAtMS44NTYtLjc5IDIuNTMgMi41MyAwIDAgMC0xLjg1Ny43OSAyLjc1MSAyLjc1MSAwIDAgMC0uNzc1IDEuOTI4YzAgLjcyNS4yNzUgMS40MDIuNzc1IDEuOTI3LjQ5NS41MDggMS4xNTYuNzkgMS44NTcuNzkuNzExIDAgMS4zNjctLjI3NiAxLjg1My0uNzg2eiIvPjwvZz48L3N2Zz4=',
    isEnabled: true,
    isNative: false,
  }),
  Token({
    address: '0x0',
    id: 1,
    name: 'Ether',
    symbol: 'ETH',
    balance: 0.6123154,
    icon:
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNTZweCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTU2IDI1NiIgd2lkdGg9IjE1NnB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZXNjLz48ZGVmcy8+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0iQ2xhc3NpYyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGlkPSJFdGhlcmV1bSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1NzAuMDAwMDAwLCAtNDEwLjAwMDAwMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1NzAuMDAwMDAwLCA0MTAuMDAwMDAwKSI+PHBhdGggZD0iTTAsMTI4IEw4MCwwIEw4MCw5My41MzU4MzcyIEwwLDEyOCBaIE0xNTYsMTI4IEw4MCw5My41ODA5NTczIEw4MCwwIEwxNTYsMTI4IFoiIGZpbGw9IiM4MjgzODQiIGlkPSJDb21iaW5lZC1TaGFwZSIvPjxwYXRoIGQ9Ik04MCwxNzYgTDAsMTMxLjAwMzk2IEw4MCw5NiBMODAsMTc2IFogTTE1NiwxMzEuMDExNDczIEw4MCwxNzYgTDgwLDk2IEwxNTYsMTMxLjAxMTQ3MyBaIiBmaWxsPSIjMzQzNTM1IiBpZD0iQ29tYmluZWQtU2hhcGUiLz48cGF0aCBkPSJNMCwxNDggTDgwLDE5NC4xODA3MTEgTDgwLDI1NiBMMCwxNDggWiBNMTU2LDE0OCBMODAsMjU2IEw4MCwxOTQuMTc1MzYxIEwxNTYsMTQ4IFoiIGZpbGw9IiM4MjgzODQiIGlkPSJDb21iaW5lZC1TaGFwZSIvPjxwb2x5Z29uIGZpbGw9IiMyRjMwMzAiIGlkPSJQYXRoLTMiIHBvaW50cz0iMTU2IDEyOCA4MCA5My41ODA5NTczIDgwIDAiLz48cG9seWdvbiBmaWxsPSIjMTMxMzEzIiBpZD0iUGF0aC01IiBwb2ludHM9IjE1NiAxMzEuMDExNDczIDgwIDk2IDgwIDE3NiIvPjxwb2x5Z29uIGZpbGw9IiMyRjMwMzAiIGlkPSJQYXRoLTciIHBvaW50cz0iMTU2IDE0OCA4MCAxOTQuMTc1MzYxIDgwIDI1NiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==',
    isEnabled: true,
    isNative: false,
  }),
  Token({
    address: '0x0',
    id: 5,
    name: 'Status',
    symbol: 'SNT',
    balance: 2.1415,
    icon:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM1QjZERUUiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTMuMyAxNS4wMmE5LjE0NCA5LjE0NCAwIDAgMC0xLjY2NC4xNDRjLjQ1Mi00LjE4IDMuOTM2LTcuMzQ2IDguMDg0LTcuMzQ2IDIuNTQgMCA0LjI4IDEuMjQ0IDQuMjggMy44MTggMCAyLjU3NS0yLjA4OSAzLjgxOS01LjEzNiAzLjgxOS0yLjI1IDAtMy4zMTQtLjQzNC01LjU2NC0uNDM0bS0uMTY0IDEuNTI0QzEwLjA4OSAxNi41NDUgOCAxNy43OSA4IDIwLjM2NGMwIDIuNTc0IDEuNzQgMy44MTggNC4yOCAzLjgxOCA0LjE0OCAwIDcuNjMyLTMuMTY1IDguMDg0LTcuMzQ2YTkuMTQ0IDkuMTQ0IDAgMCAxLTEuNjY0LjE0NGMtMi4yNSAwLTMuMzE1LS40MzUtNS41NjQtLjQzNSIvPjwvZz48L3N2Zz4=',
    isEnabled: true,
    isNative: false,
  }),
  Token({
    address: '0x0',
    id: 3,
    name: '0x Protocol',
    symbol: '0x',
    balance: 0.1254,
    icon:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjUwJSIgeDI9IjUwJSIgeTE9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuNSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1vcGFjaXR5PSIuNSIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBpZD0iYiIgY3g9IjE2IiBjeT0iMTUiIHI9IjE1Ii8+PGZpbHRlciBpZD0iYSIgd2lkdGg9IjExMS43JSIgaGVpZ2h0PSIxMTEuNyUiIHg9Ii01LjglIiB5PSItNC4yJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii41IiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIgc3RkRGV2aWF0aW9uPSIuNSIvPjxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1ck91dGVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9Im91dCIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd0JsdXJPdXRlcjEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xOTk0NzM1MDUgMCIvPjwvZmlsdGVyPjxwYXRoIGlkPSJlIiBkPSJNMTUuNDk2IDI2Yy0uMjctLjAyOC0uNTQtLjA1My0uODEtLjA4NWExMC44OCAxMC44OCAwIDAgMS00LjEyMi0xLjM2NGMtLjAxOS0uMDEtLjAzNi0uMDI1LS4wNzMtLjA1IDIuMjA2LTEuNjUgNC40MDItMy4yOSA2LjYxLTQuOTRsLjY2NS42NDdjLjM3LjM2Mi43NDIuNzIgMS4xMDUgMS4wODcuMDkuMDkuMTU1LjA4OS4yNi4wMzVhNy4xNDkgNy4xNDkgMCAwIDAgMi43MjgtMi4zOWwuMTA3LS4xNThjLjAzMS4wMzYuMDYuMDY1LjA4NC4wOTcuNzY3IDEuMDIyIDEuNTMzIDIuMDQ0IDIuMzAzIDMuMDYzLjA2Ny4wODguMDU5LjE0LS4wMTIuMjItMS43ODMgMi4wMjYtMy45OTkgMy4yNzQtNi42NyAzLjcwMS0uMzM2LjA1NC0uNjc3LjA3NC0xLjAxNi4xMTEtLjA0NS4wMDUtLjA5LjAxNy0uMTM0LjAyNmgtMS4wMjV6bS45Ny0yMmMuMTg2LjAxOS4zNzMuMDM5LjU2LjA1NiAxLjU3Ni4xNSAzLjA1LjYxNyA0LjQyMyAxLjQuMDIuMDEyLjAzNy4wMjYuMDcuMDVsLTYuNzE4IDQuODE5Yy0uMDg5LS4wODQtLjE3NS0uMTY0LS4yNi0uMjQ3LS40NzItLjQ2LS45NDYtLjkxOS0xLjQxNS0xLjM4My0uMDc1LS4wNzQtLjEzMi0uMDgyLS4yMjYtLjAzNWE3LjE0NyA3LjE0NyAwIDAgMC0yLjc3IDIuNDI0bC0uMS4xNS0yLjQ2OC0zLjI4OGMuMjQ5LS4yNjQuNDc5LS41MjcuNzI4LS43NyAxLjYyMy0xLjU4MyAzLjU1LTIuNTkgNS43ODMtMi45OTUuNDMtLjA3OC44NjktLjEwNCAxLjMwNC0uMTU1LjA0OS0uMDA1LjA5OC0uMDE3LjE0Ni0uMDI2aC45NDJ6TTYuNDU4IDkuNTM0bDQuOTk1IDYuNTQ4LTEuMDA4IDEuMDM0Yy0uMjUxLjI1Ny0uNS41MTctLjc1Ni43Ny0uMDcyLjA3Mi0uMDc1LjEyNy0uMDMxLjIxNWE3LjEzNCA3LjEzNCAwIDAgMCAyLjQyMyAyLjc3Yy4wMzUuMDIyLjA3LjA0NS4xMDMuMDcuMDA2LjAwNC4wMDkuMDE0LjAyNy4wNDhMOC45NSAyMy40MzVDNyAyMS43NTYgNS43MzUgMTkuNjg3IDUuMjI3IDE3LjE3OGMtLjU0NC0yLjY4Ni0uMTAzLTUuMjI0IDEuMjMyLTcuNjQ0em0xNC4xNzUgNC4zN2wuOTE4LS45NTNjLjI1Ni0uMjY2LjUwOC0uNTM1Ljc3LS43OTQuMDgyLS4wODEuMDgxLS4xNDIuMDMzLS4yMzhhNy4xMzcgNy4xMzcgMCAwIDAtMi40NS0yLjc5OGMtLjAzNy0uMDI1LS4wNzMtLjA1Mi0uMTM2LS4wOTdsMy4yNzktMi40NmMxLjg1NyAxLjU5IDMuMDkgMy41NSAzLjY1NiA1LjkxNS43MDcgMi45NTIuMDc3IDUuODcyLTEuMTQ3IDcuOTI4bC00LjkyMy02LjUwM3oiLz48ZmlsdGVyIGlkPSJkIiB3aWR0aD0iMTE1LjklIiBoZWlnaHQ9IjExNS45JSIgeD0iLTglIiB5PSItNS43JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii41IiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIgc3RkRGV2aWF0aW9uPSIuNSIvPjxmZUNvbG9yTWF0cml4IGluPSJzaGFkb3dCbHVyT3V0ZXIxIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjA0MjU3MjQ2IDAiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsLXJ1bGU9Im5vbnplcm8iPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2EpIiB4bGluazpocmVmPSIjYiIvPjx1c2UgZmlsbD0iIzMwMkMyQyIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjYiIvPjx1c2UgZmlsbD0idXJsKCNjKSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6c29mdC1saWdodCIgeGxpbms6aHJlZj0iI2IiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjE1IiByPSIxNC41IiBzdHJva2U9IiMwMDAiIHN0cm9rZS1vcGFjaXR5PSIuMDk3Ii8+PC9nPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2QpIiB4bGluazpocmVmPSIjZSIvPjx1c2UgZmlsbD0iI0ZGRiIgeGxpbms6aHJlZj0iI2UiLz48L2c+PC9zdmc+',
    isEnabled: true,
    isNative: false,
  }),
  Token({
    address: '0x0',
    id: 2,
    name: 'Colony',
    symbol: 'CLNY',
    balance: 22.154,
    icon:
      'data:image/png;base64,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',
    isEnabled: true,
    isNative: true,
  }),
);

export default mockTokens;
