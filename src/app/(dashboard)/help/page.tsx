"use client";

import { motion } from "framer-motion";
import { HelpCircle, Mail, MessageSquare, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function FAQCard({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm"
    >
      <h3 className="font-medium text-base mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </motion.div>
  );
}

export default function HelpPage() {
  const faqs = [
    {
      question: "How does the AI resume parsing work?",
      answer: "When you upload your master resume during onboarding, we securely parse the text to extract your experience, skills, and education. This creates a structured profile that our AI uses to tailor future job applications specifically for you."
    },
    {
      question: "Can I edit my extracted profile data?",
      answer: "Yes! You can always update your profile, add new skills, or change your job preferences by navigating to the 'Profile' section in the sidebar."
    },
    {
      question: "How are my applications tracked?",
      answer: "Whenever you apply for a job through the 'Job Discovery' portal, it automatically gets added to your 'Applications' pipeline. You can also manually add external applications to track your progress all in one place."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We encrypt all your sensitive information and never share your data with third parties without your explicit consent. Your resumes and profile data are stored securely."
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Find answers to common questions or reach out to our team.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 md:col-span-2 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                question={faq.question}
                answer={faq.answer}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Contact Us</h2>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Still need help?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Our support team is always ready to help you with any issues.
            </p>
            <Button className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm mt-4 group cursor-pointer hover:border-primary/50 transition-colors">
            <Link href="/dashboard" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <FileText className="h-4 w-4 group-hover:text-primary transition-colors" />
                </div>
                <span className="font-medium text-sm">Read the Docs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
