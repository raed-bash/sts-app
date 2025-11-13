export class FileURL {
  /**
   * @param {Blob} file
   */
  constructor(file) {
    this.file = file || null;
    this.url = file ? URL.createObjectURL(file) : null;
  }
}
