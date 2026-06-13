interface Props {
  whatsappNumber: string
}

export default function ContactSection({ whatsappNumber }: Props) {
  const waLink = `https://wa.me/91${whatsappNumber}?text=Hi%20Annfresh%2C%20I%20am%20interested%20in%20your%20salad%20plans!`

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-green-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Let&apos;s Talk Salads
          </h2>
          <p className="text-gray-400 mt-4 max-w-md mx-auto">
            Questions about plans, custom orders, or just want to say hi? We&apos;re
            a message away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp CTA */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5 hover:border-green-600/40 transition-colors">
            <div className="bg-green-600/10 border border-green-600/20 w-16 h-16 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-black text-xl mb-1">Chat on WhatsApp</h3>
              <p className="text-gray-400 text-sm">
                Fastest way to reach us. We reply within minutes.
              </p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl text-center transition-all hover:scale-[1.02]"
            >
              Message Us on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <form
            action="https://formsubmit.co/your@email.com"
            method="POST"
            className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 flex flex-col gap-4"
          >
            {/* FormSubmit config */}
            <input type="hidden" name="_subject" value="New message from Annfresh website" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://yoursite.com?sent=1" />

            <h3 className="text-white font-black text-xl mb-1">Send a Message</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Tell us what you need..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#1a1a1a] hover:bg-green-600 border border-[#2a2a2a] hover:border-green-600 text-white font-bold py-3 rounded-xl transition-all duration-200"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
