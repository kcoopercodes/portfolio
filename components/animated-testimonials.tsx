"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ArrowRight } from "lucide-react"

export type Testimonial = {
  quote: string
  name: string
  designation: string
  src: string
  slug?: string
}

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
  onSelect,
}: {
  testimonials: Testimonial[]
  autoplay?: boolean
  onSelect?: (slug: string) => void
}) {
  const [active, setActive] = useState(0)
  const rotates = useMemo(
    () => testimonials.map((_, index) => ((index * 7) % 21) - 10),
    [testimonials],
  )

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay || testimonials.length < 2) return
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  const current = testimonials[active]

  return (
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-4xl md:px-8 md:py-16 lg:px-12">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <div className="relative aspect-[4/3] w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.button
                  key={testimonial.src}
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotates[index],
                  }}
                  animate={{
                    opacity: index === active ? 1 : 0.7,
                    scale: index === active ? 1 : 0.95,
                    z: index === active ? 0 : -100,
                    rotate: index === active ? 0 : rotates[index],
                    zIndex:
                      index === active ? 40 : testimonials.length + 2 - index,
                    y: index === active ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: rotates[index],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  onClick={() => {
                    if (index === active && testimonial.slug) {
                      onSelect?.(testimonial.slug)
                    } else {
                      setActive(index)
                    }
                  }}
                  aria-label={
                    testimonial.slug
                      ? `Open ${testimonial.name}`
                      : testimonial.name
                  }
                  className="absolute inset-0 origin-bottom cursor-pointer overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-sm"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={1024}
                    height={340}
                    draggable={false}
                    className="h-full w-full object-contain object-center p-3"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="font-serif text-2xl font-normal tracking-tight text-neutral-950 md:text-3xl">
              {current.name}
            </h3>
            <p className="mt-1 font-sans text-sm text-neutral-500">
              {current.designation}
            </p>
            <motion.p className="mt-8 font-sans text-lg leading-relaxed text-neutral-600">
              {current.quote.split(" ").map((word, index) => (
                <motion.span
                  key={`${active}-${index}`}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="mt-12 flex flex-col gap-8">
            {current.slug ? (
              <button
                type="button"
                onClick={() => onSelect?.(current.slug!)}
                className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-indigo-600 px-4 font-sans text-sm font-medium text-white hover:bg-indigo-700"
              >
                View project
              </button>
            ) : null}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project"
                className="group/button flex size-9 items-center justify-center rounded-full bg-neutral-100"
              >
                <ArrowLeft className="size-5 text-neutral-950 transition-transform duration-300 group-hover/button:rotate-12" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project"
                className="group/button flex size-9 items-center justify-center rounded-full bg-neutral-100"
              >
                <ArrowRight className="size-5 text-neutral-950 transition-transform duration-300 group-hover/button:-rotate-12" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
