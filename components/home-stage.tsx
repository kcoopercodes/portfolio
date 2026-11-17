"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
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

const columns = [
  {
    y: ["-8%", "2%"] as [string, string],
    className: "-mt-2",
    tiles: [{ src: "/pushlog.jpg", slug: "pushlog", label: "View PushLog" }],
  },
  {
    y: ["12%", "4%"] as [string, string],
    className: "mt-[-35%]",
    tiles: [
      {
        src: "/bmore-tech-fest.jpg",
        slug: "bmore-tech-fest",
        label: "View Bmore Tech Fest",
      },
    ],
  },
]

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
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track })
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [75, 0])
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.2, 1])
  const yColumns = [
    useTransform(scrollYProgress, [0.5, 1], columns[0].y),
    useTransform(scrollYProgress, [0.5, 1], columns[1].y),
  ]
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const open = projects.find((project) => project.slug === openSlug) ?? null

  function openFromPoint(clientX: number, clientY: number) {
    const root = stage.current
    if (!root) return

    const stack = document.elementsFromPoint(clientX, clientY)
    for (const node of stack) {
      if (!(node instanceof Element)) continue
      const tile = node.closest("[data-project-slug]")
      if (tile instanceof HTMLElement && root.contains(tile)) {
        const slug = tile.dataset.projectSlug
        if (slug) {
          setOpenSlug(slug)
          return
        }
      }
    }

    // 3D tilt can miss the transformed hit target; map by column instead.
    const bounds = root.getBoundingClientRect()
    if (clientY < bounds.top + bounds.height * 0.28) return
    if (clientX < bounds.left || clientX > bounds.right) return
    setOpenSlug(clientX < bounds.left + bounds.width / 2 ? "pushlog" : "bmore-tech-fest")
  }

  return (
    <div className="relative bg-white text-[hsl(240_10%_3.9%)]">
      <motion.div
        className="pointer-events-none relative z-20 -mb-12 place-self-center px-6 pt-12 text-center"
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
          className="my-6 flex flex-col items-center gap-4"
        >
          <p className="font-sans text-base tracking-tight text-neutral-500 md:text-lg">
            Follow me
          </p>
          <nav
            aria-label="Social"
            className="pointer-events-auto flex items-center justify-center gap-5 md:gap-6"
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

      <div
        aria-hidden
        className="pointer-events-none absolute z-10 h-[70vh] w-full"
        style={{
          background: "linear-gradient(to right, gray, rebeccapurple, blue)",
          filter: "blur(84px)",
          mixBlendMode: "screen",
        }}
      />

      <div
        ref={track}
        className="relative z-10 h-[350vh] min-h-[120vh]"
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={stage}
          className="sticky left-0 top-0 h-svh min-h-[30rem] w-full cursor-pointer overflow-hidden"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "center top",
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
          }}
          onClick={(event) => openFromPoint(event.clientX, event.clientY)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              const bounds = stage.current?.getBoundingClientRect()
              if (!bounds) return
              openFromPoint(bounds.left + bounds.width * 0.75, bounds.top + bounds.height * 0.7)
            }
          }}
        >
          <motion.div
            className="relative mx-auto grid h-auto w-full max-w-3xl grid-cols-2 gap-2 rounded-2xl px-3 pt-[28vh] sm:gap-3 sm:px-4 md:max-w-4xl"
            style={{
              rotateX,
              scale,
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {columns.map((column, index) => (
              <motion.div
                key={index}
                className={`relative flex w-full flex-col gap-2 sm:gap-3 ${column.className}`}
                style={{ y: yColumns[index] }}
              >
                {column.tiles.map((tile) => (
                  <div
                    key={tile.slug}
                    data-project-slug={tile.slug}
                    role="button"
                    tabIndex={0}
                    aria-label={tile.label}
                    onClick={(event) => {
                      event.stopPropagation()
                      setOpenSlug(tile.slug)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        event.stopPropagation()
                        setOpenSlug(tile.slug)
                      }
                    }}
                    className="group relative w-full cursor-pointer overflow-hidden rounded-md bg-neutral-100 shadow outline-none transition duration-300 hover:brightness-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <img
                      src={tile.src}
                      alt=""
                      draggable={false}
                      className="pointer-events-none aspect-video block h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {open ? <ProjectPanel project={open} onClose={() => setOpenSlug(null)} /> : null}
    </div>
  )
}
