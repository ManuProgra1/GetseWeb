import Button from '../components/common/button'
import SplitHeading from '../components/common/split-heading'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(230,201,161,0.14),transparent_70%)]" />
      <div className="shell py-32 text-center">
        <p className="eyebrow text-gold">Error 404</p>
        <SplitHeading
          as="h1"
          trigger={false}
          mode="chars"
          className="display mx-auto mt-6 max-w-3xl text-[clamp(3rem,9vw,7rem)]"
        >
          Esta página no existe
        </SplitHeading>
        <p className="mx-auto mt-6 max-w-md text-sm text-bone/55">
          Puede que el enlace haya cambiado. Volvamos juntos al inicio.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button to="/">Volver al inicio</Button>
          <Button to="/ministerios" variant="outline" icon="arrow-up-right">
            Ver ministerios
          </Button>
        </div>
      </div>
    </section>
  )
}
