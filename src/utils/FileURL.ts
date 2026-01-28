export class FileURL {
  file: Blob | null;

  url: string | null;

  constructor(file: Blob | null) {
    this.file = file || null;
    this.url = file ? URL.createObjectURL(file) : null;
  }
}
