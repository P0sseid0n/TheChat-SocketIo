const socket = io()

const nickname = document.querySelector('#nickname').value

const sendInput = document.querySelector('#sendInput')

const sendMessage = () => {
    const message = sendInput.value.trim()

    if(!message) return
    sendInput.value = ''

    socket.emit('message', { author: nickname, message: message })
}

socket.on('renderMessage', (data) => {
    const chat = document.querySelector('#chat') 
    const message = document.createElement('p')

    message.innerText = `${data.author}: ${data.message}`

    chat.append(message)
    chat.scrollTop = chat.scrollHeight
})

sendInput.addEventListener('keyup',e => {
    if(e.key === 'Enter') sendMessage()
})

socket.on('newPerson', count => {
    const chat = document.querySelector('#chat') 
    const message = document.createElement('p')

    message.innerText = `New user is in the chat. Current: ${count}`
    message.classList += 'newPerson'

    chat.append(message)
})