export function StepSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h3 className="step-block-title">{title}</h3>
      {children}
    </section>
  )
}
