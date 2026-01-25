import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#eef5ff] via-[#f7fbff] to-[#ffffff]">

      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* HERO */}
        <section className="container mx-auto px-6 py-24 text-center max-w-6xl">
          <h1 className="text-7xl md:text-8xl font-extrabold font-[var(--font-poppins)] bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-8 tracking-tight">
            TaskFlow
          </h1>

          <p className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
            Organize your future.
            <span className="block text-primary font-medium">
              One task at a time.
            </span>
          </p>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Experience next-gen productivity with AI-powered task management,
            seamless collaboration, and a cyber-futuristic interface.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-6 mt-14 flex-wrap">
            <Link href="/dashboard">
              <button className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-xl hover:scale-105 transition">
                Open Dashboard
              </button>
            </Link>

            <Link href="/auth/login">
              <button className="px-10 py-4 text-lg font-semibold bg-white/80 backdrop-blur-xl text-gray-900 rounded-2xl shadow-xl hover:bg-white transition hover:scale-105">
                Try Smart Assistant
              </button>
            </Link>
          </div>
        </section>

        {/* PREVIEW CARDS */}
        <section className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

            {[
              {
                color: 'green',
                title: 'Review quarterly reports',
                desc: 'Complete financial analysis and prepare presentation',
                due: 'Tomorrow',
                priority: 'High Priority',
              },
              {
                color: 'yellow',
                title: 'Update project documentation',
                desc: 'Add new API endpoints and usage examples',
                due: 'This week',
                priority: 'Medium Priority',
              },
              {
                color: 'blue',
                title: 'Plan team building event',
                desc: 'Organize virtual team activities and games',
                due: 'Next month',
                priority: 'Low Priority',
              },
            ].map((task, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl p-7 rounded-3xl shadow-2xl border border-white/40 hover:-translate-y-2 transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className={`w-3 h-3 bg-${task.color}-500 rounded-full`}></div>
                  <span className="text-xs text-gray-600">{task.priority}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {task.title}
                </h3>

                <p className="text-gray-700 mb-4">
                  {task.desc}
                </p>

                <span className="text-sm text-primary font-medium">
                  Due: {task.due}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-8 text-center">
            <p className="text-gray-800 font-medium">
              Made by <span className="font-semibold">Khawaja Abdul Moiz</span>
            </p>

            <a
              href="https://www.linkedin.com/in/khawaja-abdul-moiz/"
              target="_blank"
              className="inline-block mt-3 text-primary font-medium hover:underline"
            >
              Catch Me here
            </a>

            <p className="text-xs text-gray-500 mt-4">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
