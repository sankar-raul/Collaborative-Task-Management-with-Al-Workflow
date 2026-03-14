export default function PromoForLogin() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary to-primary/80 items-center justify-center p-16 relative overflow-hidden">
        {/* Background Decorative Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full -ml-48 -mb-48 blur-3xl" />
        
        <div className="max-w-xl space-y-12 relative z-10">

          <div className="space-y-6">
            <h2 className="text-6xl font-black text-primary-foreground leading-[1.1] tracking-tighter">
              Smart Task Management <br />
              <span className="text-primary-foreground/60">for Modern Teams</span>
            </h2>

            <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed max-w-lg">
              AI-powered task assignment, real-time collaboration,
              and intelligent workload balancing for maximum productivity.
            </p>
          </div>

          {/* Mock Dashboard Card */}
          <div className="bg-card/95 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/10 space-y-8 transform hover:-translate-y-2 transition-transform duration-500">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-foreground">
                Today's Active Tasks
              </h3>
              <span className="text-xs font-black bg-primary/20 text-primary px-4 py-1.5 rounded-full border border-primary/20 uppercase tracking-widest">
                4 In Progress
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-secondary/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                <p className="text-base font-bold text-foreground">
                  Implement Authentication API
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Assigned to Rahul</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">High Priority</span>
                </div>
              </div>

              <div className="p-5 bg-secondary/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                <p className="text-base font-bold text-foreground">
                  WebSocket Integration
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Assigned to Debanjan</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Medium</span>
                </div>
              </div>

              <div className="p-5 bg-secondary/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                <p className="text-base font-bold text-foreground">
                  UI Dashboard Improvements
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Assigned to Sneha</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Low</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pt-4 border-t border-border/40">
              <span className="flex items-center gap-2 outline-current"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> REAL-TIME</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> AI MATCHING</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> SECURE</span>
            </div>
          </div>
        </div>
      </div>
  )
}
