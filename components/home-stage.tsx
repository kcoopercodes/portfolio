"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  AnimatedTestimonials,
  type Testimonial,
} from "@/components/animated-testimonials"
import { SocialIcon, socials } from "@/components/site-shell"
import { projects, type Project } from "@/lib/content"

const fade = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
}

const spring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
}

const designations: Record<string, string> = {
  pushlog: "Chrome extension",
}

const testimonials: Testimonial[] = projects.map((project) => ({
  name: project.name,
  designation: project.when ?? designations[project.slug] ?? "Project",
  quote: project.description,
  src: project.image ?? "",
  slug: project.slug,
}))

function ProjectPanel({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const actions = project.actions ?? [
    { label: project.linkLabel, href: project.link },
  ]

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="max-h-[90svh] w-full max-w-3xl overflow-auto rounded-md bg-white p-5 text-left shadow-md sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {project.when ? (
              <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                {project.when}
              </p>
            ) : null}
            <h2
              id="project-title"
              className="mt-2 font-serif text-3xl font-normal tracking-tight text-neutral-950"
            >
              {project.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-sm text-neutral-500 underline-offset-4 hover:underline"
          >
            Close
          </button>
        </div>

        {project.problem && project.solution ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
                The problem
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-700">
                {project.problem}
              </p>
            </div>
            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
                The solution
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-700">
                {project.solution}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-neutral-700">
            {project.description}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {actions.map((action, index) => (
            <a
              key={action.href}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                index === 0
                  ? "inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 font-sans text-sm font-medium text-white hover:bg-indigo-700"
                  : "inline-flex h-10 items-center justify-center rounded-md border border-indigo-200 bg-white px-4 font-sans text-sm font-medium text-indigo-700 hover:border-indigo-600"
              }
            >
              {action.label}
            </a>
          ))}
        </div>
      </article>
    </div>
  )
}

export function HomeStage() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const open = projects.find((project) => project.slug === openSlug) ?? null

  return (
    <div className="relative bg-white text-neutral-950">
      <motion.div
        className="relative z-20 mx-auto max-w-3xl px-6 pt-10 text-center md:pt-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.div variants={fade} transition={spring}>
          <h1 className="font-serif text-4xl font-normal tracking-tight md:text-5xl">
            The things <span className="text-indigo-600">I built</span>
          </h1>
        </motion.div>
        <motion.div variants={fade} transition={spring}>
          <h1 className="font-serif text-4xl font-normal tracking-tight md:text-5xl">
            in one place
          </h1>
        </motion.div>
        <motion.div
          variants={fade}
          transition={spring}
          className="mt-5 mb-2 flex flex-col items-center gap-3"
        >
          <p className="font-sans text-base tracking-tight text-neutral-500 md:text-lg">
            Follow me
          </p>
          <nav
            aria-label="Social"
            className="flex items-center justify-center gap-5 md:gap-6"
          >
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex size-11 items-center justify-center text-indigo-600 transition-colors hover:text-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:size-12"
              >
                <SocialIcon className="size-6 md:size-7" path={item.path} />
              </a>
            ))}
          </nav>
        </motion.div>
      </motion.div>

      <AnimatedTestimonials
        testimonials={testimonials}
        onSelect={setOpenSlug}
      />

      {open ? <ProjectPanel project={open} onClose={() => setOpenSlug(null)} /> : null}
    </div>
  )
}
