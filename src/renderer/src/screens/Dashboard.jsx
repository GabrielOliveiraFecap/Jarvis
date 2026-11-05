export default function Dashboard() {
  const now = new Date()
  let text
  const name = 'Gabriel'
  const dataHoje = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
  if (now.getHours() < 12) {
    text = `Olá ${name}. Bom dia!`
  } else if (now.getHours() < 18) {
    text = `Olá ${name}. Boa tarde!`
  } else {
    text = `Olá ${name}. Boa noite!`
  }

  return (
    <>
      <h2>{text}</h2>
      <p className="text-sand">{dataHoje}</p>
    </>
  )
}
