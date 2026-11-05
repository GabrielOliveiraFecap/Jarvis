// Faixa do topo que substitui a barra do Windows. A área com app-region drag move a janela.
export default function TitleBar() {
  return (
    <div className="flex h-10 shrink-0 items-center border-b border-line px-4 text-sm text-sand [-webkit-app-region:drag]">
      Jarvis
    </div>
  )
}
