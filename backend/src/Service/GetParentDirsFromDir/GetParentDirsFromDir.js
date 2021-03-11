
export default class GetParentDirsFromDir {
  constructor(pathToFolder) {
    this.path = pathToFolder;
  }

  getParentDirs() {
    const paths = this.path.split('/');
    
    const result = [];
    for (let i = paths.length; i >= 1; i -= 1) {
      const path = [];
      for (let j = 0; j < i; j += 1) {
        path.push(paths[j]);
      }
      result.push(path.join('/'));
    }
    return result;
  }
}
