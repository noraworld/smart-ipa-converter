class Dictionary {
  constructor(filepath) {
    this.filepath = filepath;
  }

  load() {
    const xhr = new XMLHttpRequest();
    const url = this.filepath;

    xhr.open('GET', url, false);
    xhr.overrideMimeType(this.type);
    xhr.send();

    if (xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE) {
      return JSON.parse(xhr.responseText)['en_US'][0];
    }
    else {
      return null;
    }
  }
}

export default Dictionary;
