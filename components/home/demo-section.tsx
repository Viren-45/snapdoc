import { Pizza } from 'lucide-react';
import { SummaryViewer } from '@/components/summaries/summary-viewer';
import { MotionDiv, MotionH3 } from '../common/motion-wrapper';

const DEMO_SUMMARY = `# Quick Overview
• 🧘 A practical guide to cultivating mindfulness and mental clarity through simple daily habits and awareness techniques.

# Document Details
• 📑 Type: Self-Development Guide
• 👥 For: Anyone seeking calm, focus, and inner peace

# Key Highlights
• 🌿 Step-by-step introduction to mindfulness practices
• 🧠 Understanding how thoughts shape our mood
• ⏳ Techniques to pause, reflect, and reset your mind

# Why It Matters
• 💡 In an age of constant distraction and pressure, learning to be present improves mental well-being, reduces stress, and enhances life satisfaction.

# 📄 Main Points
• 🛑 How to observe thoughts without reacting
• 💬 Mindful communication and active listening
• 🌅 Morning rituals to start the day grounded
• 💤 Nighttime reflection for peaceful sleep
• 📓 Journaling prompts for emotional awareness

# Pro Tips
• ⏲️ Try 2-minute breathing pauses during busy days
• 📵 Keep your phone out of sight during meals
• ☀️ Step outside each day—even for a few mindful breaths
• 📚 Track moods weekly to identify stress patterns

# Key Terms to Know
• 🧘 Mindfulness: The art of being fully present in the moment
• 🔁 Rumination: Repetitive, often negative thinking loops
• 💨 Box Breathing: A simple technique to calm the nervous system
• 🎯 Intention Setting: Defining how you want to feel and act each day

# Bottom Line
• 🌟 Mindfulness is a life skill that empowers you to respond—not react—to life’s challenges, with calm and clarity.

# 🔥 Final Thoughts
This guide makes mindfulness approachable and sustainable, giving you the tools to build a calmer, more focused, and fulfilling daily life.`;

export default function DemoSection() {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-500" />
          </div>
          <div className="text-center mb-16">
            <MotionH3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6"
            >
              Watch how Sommaire transforms this{' '}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                Mindful Living PDF
              </span>{' '}
              into an easy-to-read summary!
            </MotionH3>
          </div>
        </div>

        <div className="flex justify-center items-center px-2 sm:px-4 lg:px-6">
          {/** Summary Viewer */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SummaryViewer summary={DEMO_SUMMARY} />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}