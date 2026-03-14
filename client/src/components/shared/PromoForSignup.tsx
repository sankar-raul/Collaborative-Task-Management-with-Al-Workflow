
export default function PromoForSignup() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary to-primary/80 items-center justify-center p-16 relative overflow-hidden">
        {/* Background Decorative Patterns */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -mr-48 -mb-48 blur-3xl" />

        <div className="max-w-xl space-y-12 relative z-10">

          <div className="space-y-6">
            <h2 className="text-6xl font-black text-primary-foreground leading-[1.1] tracking-tighter">
              Supercharge your <br />
              <span className="text-primary-foreground/60">team's workflow</span>
            </h2>

            <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed max-w-lg">
              Join thousands of professionals using AI TaskFlow to ship products faster and manage tasks seamlessly without the clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6">
            {[
              { title: "Smart Assignments", desc: "AI automatically matches tasks to team members based on their skills." },
              { title: "Real-time Sync", desc: "Collaborate instantly across boards, lists, and timelines." },
              { title: "Deep Integrations", desc: "Connects with GitHub, Slack, and your favorite developer tools." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-6 p-8 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 group">
                <div className="w-3 h-12 bg-primary-foreground/20 rounded-full group-hover:bg-primary-foreground/40 transition-colors" />
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">{feature.title}</h3>
                  <p className="text-base text-primary-foreground/70 mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}
