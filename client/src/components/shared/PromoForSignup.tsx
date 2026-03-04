
export default function PromoForSignup() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-900 to-indigo-700 items-center justify-center p-12">
        <div className="max-w-lg space-y-8">

          <h2 className="text-5xl font-serif text-white leading-tight">
            Supercharge your team's workflow
          </h2>

          <p className="text-lg text-indigo-200">
            Join thousands of professionals using AI TaskFlow to ship products faster and manage tasks seamlessly without the clutter.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-4">
            {[
              { title: "Smart Assignments", desc: "AI automatically matches tasks to team members based on their skills." },
              { title: "Real-time Sync", desc: "Collaborate instantly across boards, lists, and timelines." },
              { title: "Deep Integrations", desc: "Connects with GitHub, Slack, and your favorite developer tools." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 border-l-4 border-l-indigo-400">
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-indigo-200 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}
