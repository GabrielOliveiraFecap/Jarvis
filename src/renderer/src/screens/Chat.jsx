import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  function handleSend(event) {
    event.preventDefault()

    if (!text) {
      return
    }

    const mensagemUsuario = { role: 'user', content: text }
    const mensagemJarvis = { role: 'assistant', content: 'Você disse: ' + text }

    setMessages([...messages, mensagemUsuario, mensagemJarvis])
    setText('')
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Chat</h2>

      <ul className="flex flex-col gap-3">
        {messages.map((message, index) => {
          return (
            <li
              key={index}
              className={
                message.role === 'user'
                  ? 'max-w-[80%] self-end rounded-xl bg-cream px-4 py-2 text-ink'
                  : 'max-w-[80%] self-start rounded-xl border border-line bg-panel px-4 py-2'
              }
            >
              {message.content}
            </li>
          )
        })}
      </ul>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escreva uma mensagem"
          className="flex-1 rounded-xl border border-line bg-panel px-4 py-3 placeholder:text-sand focus:border-cream/40 focus:outline-none"
        />
        <button className="rounded-xl bg-cream px-5 font-medium text-ink hover:bg-cream/90">
          Enviar
        </button>
      </form>
    </section>
  )
}
