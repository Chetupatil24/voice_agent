export default function LandingPage() {
  return (
    <div className="antialiased overflow-x-hidden">
      {/* TopNav */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-[#10131c]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">VaaniAI</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-primary border-b-2 border-primary pb-1 font-headline text-sm font-medium" href="#">English</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-medium" href="#">Hindi</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm font-medium" href="#">Kannada</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="px-5 py-2 border border-outline-variant/40 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-all">Login</a>
          <a href="/register" className="px-5 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">Get Started</a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 hero-mesh overflow-hidden">
          <div className="absolute inset-0 grid-overlay" />
          <div className="relative z-10 max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant">Built for India&apos;s 63M+ SMBs</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface leading-tight mb-6 tracking-tight">
              Your Business Answers Every Call.{" "}<br />
              <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">Even at 3 AM.</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Multilingual AI Voice Agents for Indian SMBs. Handle inquiries, book appointments, and close sales in English, Hindi, and Kannada while you sleep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register" className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">Start Free Trial</a>
              <button className="px-8 py-4 bg-surface-container text-on-surface font-semibold rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-all">Watch Demo</button>
            </div>
          </div>
          <div className="relative mt-20 w-full max-w-6xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden h-[260px] relative flex items-end p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="relative z-10">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded mb-3 inline-block font-bold uppercase tracking-widest">LIVE RECEPTIONIST</span>
                  <h3 className="text-2xl font-headline font-bold text-on-surface">Intelligent Call Routing</h3>
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-container rounded-2xl border border-outline-variant/10 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-tertiary text-4xl">payments</span>
                  <span className="text-primary text-sm font-bold">+24% ROI</span>
                </div>
                <div>
                  <p className="text-3xl font-headline font-bold text-on-surface">&#8377;45,200</p>
                  <p className="text-on-surface-variant text-sm">Revenue saved this month</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 bg-surface-container-lowest border-y border-outline-variant/5">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold mb-8">TRUSTED BY INNOVATIVE INDIAN ENTERPRISES</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40">
              {["w-32","w-28","w-36","w-24"].map((w,i)=><div key={i} className={`h-8 ${w} bg-on-surface/20 rounded-md`}/>)}
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-6 leading-tight">Hear the future of<br />Indian commerce.</h2>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">Our AI understands dialects, accents, and local nuances. Switch between languages instantly during the call.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary">translate</span></div>
                  <div><h4 className="font-bold text-on-surface">Multi-Dialect Support</h4><p className="text-sm text-on-surface-variant">Seamless Hindi-English (Hinglish) understanding.</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"><span className="material-symbols-outlined text-secondary">flash_on</span></div>
                  <div><h4 className="font-bold text-on-surface">Ultra-Low Latency</h4><p className="text-sm text-on-surface-variant">&lt;200ms response time for natural conversations.</p></div>
                </div>
              </div>
            </div>
            <div className="flex justify-center relative">
              <div className="w-[280px] h-[540px] bg-surface-container-highest rounded-[3rem] p-4 border-[8px] border-surface-variant shadow-2xl relative z-10">
                <div className="w-28 h-6 bg-surface-variant absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />
                <div className="h-full w-full bg-[#050810] rounded-[2.2rem] overflow-hidden flex flex-col items-center justify-between py-10 px-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 pulse-ring">
                      <span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings:"'FILL' 1"}}>mic</span>
                    </div>
                    <h4 className="text-xl font-headline font-bold text-on-surface mb-1">Vaani AI</h4>
                    <p className="text-primary text-sm font-bold animate-pulse">Listening...</p>
                  </div>
                  <div className="flex items-center justify-center gap-1 h-12 w-full">
                    {[4,8,12,6,10,4].map((h,i)=><div key={i} className="w-1 rounded-full bg-primary animate-bounce" style={{height:`${h*4}px`,animationDelay:`${i*0.1}s`}}/>)}
                  </div>
                  <div className="w-full space-y-3">
                    <div className="flex gap-2 p-1 bg-surface-container rounded-lg">
                      <button className="flex-1 text-[10px] py-2 font-bold rounded bg-primary text-on-primary">EN</button>
                      <button className="flex-1 text-[10px] py-2 font-bold rounded text-on-surface-variant">HI</button>
                      <button className="flex-1 text-[10px] py-2 font-bold rounded text-on-surface-variant">KN</button>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-xl">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">&quot;Hello, I am calling from Vaani Dental. How can I help you?&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[100px] -z-0" />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-headline font-bold text-on-surface mb-4">Transparent Pricing</h2>
              <p className="text-on-surface-variant">Scale your business without scaling your headcount.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-surface-container-low border-t-4 border-primary flex flex-col justify-between hover:bg-surface-container transition-all">
                <div>
                  <h3 className="text-xl font-bold mb-2">Starter</h3>
                  <p className="text-3xl font-headline font-bold mb-6">&#8377;2,499<span className="text-sm font-normal text-on-surface-variant">/mo</span></p>
                  <ul className="space-y-4 mb-8">
                    {["500 Minutes/month","2 Shared Numbers","Basic Appointment Booking"].map(f=>(
                      <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary text-lg">check_circle</span>{f}</li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-container-high transition-all">Get Started</button>
              </div>
              <div className="p-8 rounded-2xl bg-surface-container-low border-t-4 border-secondary relative shadow-2xl scale-105 z-10 flex flex-col justify-between">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">Most Popular</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Growth</h3>
                  <p className="text-3xl font-headline font-bold mb-6">&#8377;7,999<span className="text-sm font-normal text-on-surface-variant">/mo</span></p>
                  <ul className="space-y-4 mb-8">
                    {["2,000 Minutes/month","Custom Dedicated Number","CRM Integration (HubSpot/Zoho)"].map(f=>(
                      <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span>{f}</li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:opacity-90 transition-all">Select Growth</button>
              </div>
              <div className="p-8 rounded-2xl bg-surface-container-low border-t-4 border-tertiary flex flex-col justify-between hover:bg-surface-container transition-all">
                <div>
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <p className="text-3xl font-headline font-bold mb-6">Custom</p>
                  <ul className="space-y-4 mb-8">
                    {["Unlimited Minutes","Custom Voice Training","Dedicated Account Manager"].map(f=>(
                      <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>{f}</li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-container-high transition-all">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/10 rounded-[2rem] p-12 text-center border border-outline-variant/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><span className="material-symbols-outlined text-[120px]">support_agent</span></div>
            <h2 className="text-4xl font-headline font-bold mb-6">Ready to never miss a lead?</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto">Join 2,000+ Indian businesses automating their front desk with VaaniAI.</p>
            <a href="/register" className="px-10 py-5 bg-on-surface text-surface font-bold rounded-2xl hover:bg-white transition-all hover:scale-105 inline-block">Get Started Free</a>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline">VaaniAI</span>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed">Intelligence that speaks your language. Built with pride in India for the world&apos;s most dynamic businesses.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            {[{title:"Product",links:["Features","Integrations","Enterprise"]},{title:"Company",links:["About Us","Careers","Blog"]},{title:"Legal",links:["Privacy Policy","Terms of Service"]}].map(s=>(
              <div key={s.title}>
                <h5 className="text-on-surface font-bold text-sm mb-4">{s.title}</h5>
                <ul className="space-y-2 text-xs text-on-surface-variant">{s.links.map(l=><li key={l}><a className="hover:text-primary transition-colors" href="#">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-outline-variant/5 flex items-center justify-between">
          <p className="text-[10px] text-on-surface-variant/40">&#169; 2024 VaaniAI Technologies Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

