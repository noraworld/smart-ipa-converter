class Dictionary {
  load(filepath) {
    const xhr = new XMLHttpRequest()
    const url = filepath

    xhr.open('GET', url, false)
    xhr.overrideMimeType(this.type)
    xhr.send()

    if (xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE) {
      return JSON.parse(xhr.responseText)
    }
    else {
      return null
    }
  }
}

export default Dictionary
