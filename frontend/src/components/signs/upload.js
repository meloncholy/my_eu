/* global fetch */

import React from 'react'
import queryString from 'query-string'

const SIGNS_UPLOAD_URL =
  'https://europe-west1-my-eu-1532800860795.cloudfunctions.net/signs_upload'

const SIGNS_SUBMIT_URL =
  'https://europe-west1-my-eu-1532800860795.cloudfunctions.net/signs_submit'

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.fileRef = React.createRef()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getSignedUploadUrl(file) {
    const query = queryString.stringify({ content_type: file.type })
    return fetch(`${SIGNS_UPLOAD_URL}?${query}`)
      .then(response => {
        return response.json()
      })
      .catch(error => {
        throw error
      })
  }

  uploadFile(file, fileName, signedUrl) {
    fetch(signedUrl, {
      mode: 'cors',
      method: 'PUT',
      body: file
    }).then(() => {
      return fetch(SIGNS_SUBMIT_URL, {
        mode: 'cors',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_name: fileName,
          latitude: 51.515454,
          longitude: -0.132488
        })
      })
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const file = this.fileRef.current.files[0]
    this.getSignedUploadUrl(file).then(({ fileName, url }) => {
      return this.uploadFile(file, fileName, url)
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="file" name="file" accept="image/*" ref={this.fileRef} />
        <input type="submit" />
      </form>
    )
  }
}

export default Upload
