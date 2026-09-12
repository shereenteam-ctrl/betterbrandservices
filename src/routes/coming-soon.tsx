import { Link } from '@tanstack/react-router'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <Sparkles className="mx-auto mb-6" size={48} />
        <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-4">
          BBS AI
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Coming Soon
        </h1>
        <p className="text-lg opacity-70 mb-8">
          Our AI website builder is being prepared. We’ll be launching it soon.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
        >
          <ArrowLeft size={18} />
          Back to Better Brand Services
        </Link>
      </div>
    </main>
  )
}
