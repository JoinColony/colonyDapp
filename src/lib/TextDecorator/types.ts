export type Schema = {
  prefix: string;
  name: string;
  schema: {
    validate: (text: string, pos: number, self: any) => any;
  };
};
