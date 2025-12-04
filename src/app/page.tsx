import URLShortenerForm from "@/components/url-shortener-form";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50 via-white to-white" />

      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle, #00000008 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header - Minimal */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-6xl">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-gray-900">HSIBS Shortener</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero - Clean & Spacious */}
      <section className="container mx-auto px-6 pt-24 pb-16 max-w-4xl">
        <div className="text-center mb-16 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Free & Open Source
          </div>

          {/* Heading - Simple Typography */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Shorten your links.
            <br />
            <span className="text-gray-400">Share with ease.</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Transform long URLs into short, shareable links in seconds. No
            registration required.
          </p>
        </div>

        {/* Main Form */}
        <URLShortenerForm />

        <div>
          <div className="bg-transparent rounded-md flex items-center justify-center transition-colors">
            <Image
              alt="Logo"
              src="/hsibs.webp"
              width={32}
              height={32}
              className="text-white font-bold text-sm mt-4"
            ></Image>
          </div>
          <p className="text-sm text-center text-gray-400 mt-4">
            Presented by HSI Boarding School.
          </p>
        </div>
      </section>

      {/* Features - Minimal Cards */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Lightning Fast",
              description: "Generate short links instantly without any delays",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
            {
              title: "Custom Codes",
              description: "Choose your own memorable short codes for branding",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              ),
            },
            {
              title: "Click Analytics",
              description:
                "Track link performance with real-time click statistics",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              ),
            },
          ].map((feature, idx) => (
            <div key={idx} className="group">
              <div className="p-8 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700 mb-4 group-hover:bg-gray-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-gray-100 mt-24">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2025 HSIBS Shortener</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
