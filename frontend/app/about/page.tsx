import Link from 'next/link';

export default function AboutPage() {
  const timelineItems = [
    {
      year: '2024',
      title: 'Foundation',
      description: 'TaskFlow was born from the vision to revolutionize task management with AI-powered assistance and cyber-futuristic design.',
      icon: '🚀'
    },
    {
      year: '2025',
      title: 'AI Integration',
      description: 'Integrated advanced AI agents for intelligent task suggestions, smart prioritization, and natural language processing.',
      icon: '🤖'
    },
    {
      year: '2026',
      title: 'Cyber Era',
      description: 'Launched the revolutionary 2077-style interface with glassmorphism, smooth animations, and premium user experience.',
      icon: '⚡'
    }
  ];

  const features = [
    {
      title: 'Vision',
      description: 'To create the most advanced, AI-powered task management platform that feels like it\'s from the future.',
      icon: '👁️'
    },
    {
      title: 'Tech Stack',
      description: 'Built with Next.js, FastAPI, PostgreSQL, and cutting-edge AI technologies for maximum performance and security.',
      icon: '⚙️'
    },
    {
      title: 'Why Different',
      description: 'Unlike traditional todo apps, TaskFlow combines AI intelligence, cyber aesthetics, and seamless collaboration in one premium package.',
      icon: '✨'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              About TaskFlow
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Pioneering the future of productivity with AI-powered task management and cyber-futuristic design.
            </p>
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-foreground mb-12 animate-slide-up">Our Journey</h2>
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-30"></div>

              {timelineItems.map((item, index) => (
                <div
                  key={item.year}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-slide-in`}
                  style={{ animationDelay: `${0.3 + index * 0.2}s` }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="glass-xl p-6 rounded-2xl shadow-lg border border-white/30 card-hover">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg animate-glow"></div>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                    <div className="text-2xl font-bold text-primary">{item.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-xl p-8 rounded-2xl shadow-lg border border-white/30 text-center card-hover animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link href="/dashboard">
              <button className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cyber-border">
                Experience the Future
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}