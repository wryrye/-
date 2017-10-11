export class sentSet{ //data structure for sets of sentences
  name: string;
  data:Array<Array<string>>;

  constructor(name: string, data: Array<Array<string>> ) {
    this.name = name;
    this.data = data;
  }
}
