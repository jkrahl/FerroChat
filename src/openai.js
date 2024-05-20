'use strict'

export class Thread {
  /**
   * @param {string} apiKey
   * @param {string} threadID
   */
  constructor(apiKey, threadID) {
    this.apiKey = apiKey
    this.threadID = threadID
  }

  /**
   * @returns {HeadersInit}
   */
  get ThreadFetchHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'OpenAI-Beta': 'assistants=v2',
    }
  }

  /**
   * @param {string} message
   * @returns {Promise<string>} ID of the new message
   */
  async sendMessage(message) {
    return fetch(
      `https://api.openai.com/v1/threads/${this.threadID}/messages`,
      {
        method: 'POST',
        headers: this.ThreadFetchHeaders,
        body: JSON.stringify({
          role: 'user',
          content: message,
        }),
      }
    )
      .then((response) => response.json())
      .then((obj) => obj.id)
  }

  /**
   * @param {string} assistant_id
   * @returns {Promise<string>} ID of the run.
   */
  async sendRun(assistant_id) {
    return fetch(`https://api.openai.com/v1/threads/${this.threadID}/runs`, {
      method: 'POST',
      headers: this.ThreadFetchHeaders,
      body: JSON.stringify({
        assistant_id: assistant_id,
      }),
    })
      .then((response) => response.json())
      .then((obj) => obj.id)
  }

  /**
   * @returns {Promise<string>} Value of the last message.
   */
  async retrieveLastMessage() {
    return fetch(
      `https://api.openai.com/v1/threads/${this.threadID}/messages`,
      {
        method: 'GET',
        headers: this.ThreadFetchHeaders,
      }
    )
      .then((response) => response.json())
      .then((obj) => obj.data?.[obj.data.length - 1].content.text.value)
  }
}

export default class OpenAI {
  /**
   * @param {string} apiKey
   * @param {string} assistantID
   */
  constructor(apiKey, assistantID) {
    this.apiKey = apiKey
    this.thread = undefined
    this.assistantID = assistantID
  }

  /**
   * @param {string} message
   */
  async SendAndReceive(message) {
    if (!this.thread) {
      this.thread = await createThread(this.apiKey)
      this.threadCreated = true
    }

    await this.thread.sendMessage(message)
    await this.thread.sendRun(this.assistantID)
    let lastMessage = await this.thread.retrieveLastMessage()

    return lastMessage
  }
}

/**
 * @param {string} apiKey
 * @returns {Promise<Thread>}
 */
async function createThread(apiKey) {
  return fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2',
    },
  })
    .then((response) => response.json())
    .then((obj) => new Thread(apiKey, obj.id))
}

console.log('openai.js loaded')
