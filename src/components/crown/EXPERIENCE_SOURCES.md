# Scroll experience sources

Adapted locally for AIAK. No hosted AI generation used.

- [Interactive Scrolling Story Component, minhxthanh](https://21st.dev/@minhxthanh/components/interactive-scrolling-story-component), demo 6265. Sticky stage, matched story and visual changes, and scene navigation. Rebuilt around native page scroll, real interactive workflow examples, and reduced motion controls.
- [Animated Beam, dillionverma](https://21st.dev/@dillionverma/components/animated-beam), demo 919. Element measurement and ResizeObserver connector geometry. Adapted to the existing GSAP/CSS stack, with offscreen animation pausing and reduced motion.
- [Container Scroll Animation, manuarora700](https://21st.dev/@manuarora700/components/container-scroll-animation), demo 1081. Perspective, rotation, and scale on entry. Adapted to GSAP ScrollTrigger without a new animation dependency.
- [Cursor Follow, educalvolpz](https://21st.dev/@educalvolpz/components/cursor-follow), demo 4283. Contextual hover labels adapted to a single delegated GSAP pointer cue with different shapes for workflow, brain controls, and project previews. The native pointer remains visible.
- [Cursor Spotlight, pulkitxm](https://21st.dev/@pulkitxm/components/cursor-spotlight), demo 18361. Local pointer coordinates drive restrained surface lighting in the workflow and proof sections.
- [Magnetic, ibelick](https://21st.dev/@ibelick/components/magnetic), demo 649. Small button attraction and pointer-responsive paper tilt, using existing GSAP and CSS. Touch and reduced motion disable these effects; no new runtime dependency.
- [Cinematic Orbit Hero, daiwiikharihar](https://21st.dev/@daiwiikharihar/components/cinematic-orbit-hero), demo 32357. A pinned stage on native page scroll, depth-scaled cards with matching stacking order, and pointer parallax. Rebuilt as the three.js workspace in `MyWorkspace.jsx`: the scene stays pinned while twelve steps scroll past it (each area's introduction, then its three documents), with projected HTML labels and no Motion or new dependency. On phones the scene pins to the top and the steps scroll beneath it.
- [Optimized Tilt Card, sh20raj](https://21st.dev/@sh20raj/components/optimized-tilt-card), demo 27139. Pointer tilt up to 11 degrees with a slight lift, a light sheen at the pointer, and touch hold on phones. Applied to the floating documents in the 3D workspace, combined with their lean toward the core, without React state per move.
- [3D Cards Slider, dhileepkumargm](https://21st.dev/@dhileepkumargm/components/3d-cards-slider), demo 7829. The depth of field idea: cards out of focus blur and dim. Used for the station labels by distance from the camera, the focus shift when the area changes, and the steps away from the reading line. Adapted from its published description and preview; no code retrieved.
- [Email Draft, affectUI](https://21st.dev/@flohoeller_5a53e102/components/email-draft), demo 44435. The layout of a drafted email under review: recipient and attachment, the message, tone choices, a review action, and the assistant's status. Rebuilt as a fictional example that never sends. Adapted from its published description and preview; no code retrieved.

The "Built into my own business" section is a simplified illustration of how I manage client work, coordinate projects with Ken at CompuSolutionX, and run research, in the wording approved on 2026-11-05. Website audits are left out of it on purpose. It shows no real client files, messages, or project names, and it is not a live activity feed or a client performance claim.


## 2026-11-07: Site navigation and homepage clarity

- [Kokonut UI Bento Grid](https://21st.dev/@kokonutd/components/bento-grid), demo 622: retrieved through the configured 21st MCP after checking paid retrieval allowance. Adapted the card hierarchy, restrained hover elevation, and dark surfaces into `sections/HomeOverview.jsx`. Entire service cards are ordinary links; actions remain visible on phones and keyboard focus. No dependency or hosted AI generation added.
- Retained the existing One Brain scroll story on its dedicated route. Added chapter links, a workflow shortcut, and wider desktop orbit geometry to protect copy. Website proof reuses the existing public builds and images. All homepage workflow examples are illustrative.
- Booking intent and service-click analytics contain only page paths and service labels. Cal.com completion uses its installed SDK's `bookingSuccessfulV2` event without attendee data. Website calendar completion remains in its own provider reporting.
