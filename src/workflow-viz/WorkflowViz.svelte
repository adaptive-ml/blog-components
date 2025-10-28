<svelte:options
    customElement={{
        tag: "workflow-viz",
    }}
/>

<script>
    import { onMount } from "svelte";
    import Code from "carbon-icons-svelte/lib/Code.svelte";
    import User from "carbon-icons-svelte/lib/User.svelte";
    import Ai from "carbon-icons-svelte/lib/Ai.svelte";
    import BuildTool from "carbon-icons-svelte/lib/BuildTool.svelte";
    import Chat from "carbon-icons-svelte/lib/Chat.svelte";

    const iconMap = {
        Code,
        User,
        Ai,
        BuildTool,
        Chat
    };

    function loadIcon(iconName) {
        return iconMap[iconName] || Code;
    }

    function parseInlineContent(elements) {
        const items = Array.from(elements ?? []);
        const workflowSteps = items.filter(
            (el) => el.tagName && el.tagName.toLowerCase() === "workflow-step"
        );

        if (workflowSteps.length === 0) {
            return { steps: [], styles: "" };
        }

        const steps = workflowSteps.map(stepEl => {
            const tier2El = stepEl.querySelector('tier2');
            const tier3El = stepEl.querySelector('tier3');

            return {
                id: stepEl.getAttribute('id') || '',
                label: stepEl.getAttribute('label') || '',
                subtitle: stepEl.getAttribute('subtitle') || '',
                color: stepEl.getAttribute('color') || '',
                icon: stepEl.getAttribute('icon') || 'Code',
                tier2: tier2El ? tier2El.innerHTML : '',
                tier3: tier3El ? tier3El.innerHTML : ''
            };
        });

        const stylesEl = items.find(
            el => el.tagName && el.tagName.toLowerCase() === 'workflow-styles'
        );
        const styles = stylesEl ? stylesEl.textContent : "";

        return { steps, styles };
    }

    const nodeSpacing = 56;
    const nodeHeight = 38;
    const nodeWidth = 128;
    const chartHorizontalPadding = 32;

    let { interactive = true, step = 0, expanded = false } = $props();

    const isInteractive = interactive === "false" ? false : Boolean(interactive);
    const initialStep = typeof step === "string" ? parseInt(step, 10) : step;
    const isExpandedByDefault = expanded === "false" ? false : Boolean(expanded);

    let stepsWithIcons = $state([]);
    let inlineStyles = $state("");

    const flowchartWidth = nodeWidth + chartHorizontalPadding;

    let currentStep = $state(initialStep);
    let autoplay = $state(isInteractive);
    let showAdvanced = $state(isExpandedByDefault);
    let flowchartEl;
    let tier2El;
    let tier3El;
    let previousStep = 0;
    let gsapInstance;
    let gsapLoadPromise;
    let activeTransitionTimeline;

    const activeStep = $derived(stepsWithIcons[currentStep] ?? stepsWithIcons[0]);
    const ActiveIcon = $derived(activeStep?.icon ?? Code);

    function getNodeX() {
        return (flowchartWidth - nodeWidth) / 2;
    }

    function getNodeCenter() {
        return getNodeX() + nodeWidth / 2;
    }

    const topPadding = 12;
    const flowchartHeight = $derived(stepsWithIcons.length * nodeSpacing);

    async function loadAnimations() {
        if (!isInteractive) {
            return undefined;
        }

        if (gsapInstance) {
            return gsapInstance;
        }

        if (!gsapLoadPromise) {
            gsapLoadPromise = import("gsap")
                .then((module) => module.gsap ?? module.default ?? module)
                .catch(() => undefined);
        }

        gsapInstance = await gsapLoadPromise;

        if (!gsapInstance) {
            gsapLoadPromise = undefined;
        }

        return gsapInstance;
    }

    function animateNodeEntrance() {
        if (!gsapInstance || !flowchartEl) return;

        const nodes = flowchartEl.querySelectorAll(".node");

        gsapInstance.fromTo(
            nodes,
            {
                opacity: 0,
                y: 20,
                scale: 0.95,
            },
            {
                opacity: (index, target) => {
                    return target.classList.contains("active") ? 1 : 0.6;
                },
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
            }
        );
    }

    function animateNodeState(nodeEl, isActive, isInteractive = true) {
        if (!gsapInstance || !nodeEl) return;

        const rect = nodeEl.querySelector(".node-rect");
        const icon = nodeEl.querySelector(".node__icon");
        const content = nodeEl.querySelector(".node__content");

        const timeline = gsapInstance.timeline();

        if (isActive) {
            timeline
                .to(nodeEl, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto",
                }, 0)
                .to(rect, {
                    attr: {
                        "stroke-opacity": 1,
                        "stroke-width": 1.8
                    },
                    duration: 0.45,
                    ease: "power2.out",
                    overwrite: "auto",
                }, 0)
                .to(icon, {
                    scale: 1.08,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.6)",
                    overwrite: "auto",
                }, 0.1)
                .to(content, {
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                }, 0);
        } else {
            const targetOpacity = isInteractive ? 0.6 : 0.1;

            timeline
                .to(nodeEl, {
                    opacity: targetOpacity,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.inOut",
                    overwrite: "auto",
                }, 0)
                .to(rect, {
                    attr: {
                        "stroke-opacity": 0.28,
                        "stroke-width": 1.2
                    },
                    duration: 0.35,
                    ease: "power2.inOut",
                    overwrite: "auto",
                }, 0)
                .to(icon, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto",
                }, 0)
                .to(content, {
                    boxShadow: "0 0 0 rgba(15, 23, 42, 0)",
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto",
                }, 0);
        }
    }

    function animateStepChange(newStep) {
        if (!gsapInstance) {
            previousStep = newStep;
            return;
        }

        if (newStep === previousStep) {
            return;
        }

        if (activeTransitionTimeline) {
            activeTransitionTimeline.kill();
        }

        const previousNode = flowchartEl?.querySelector(`.node[data-step="${previousStep}"]`);
        const newNode = flowchartEl?.querySelector(`.node[data-step="${newStep}"]`);

        activeTransitionTimeline = gsapInstance.timeline();

        if (previousNode) {
            animateNodeState(previousNode, false, isInteractive);
        }

        if (newNode) {
            activeTransitionTimeline.add(() => {
                animateNodeState(newNode, true, isInteractive);
            }, 0.1);
        }

        const newLine = flowchartEl?.querySelector(`[data-line="${newStep}"]`);
        if (newLine) {
            const path = newLine.querySelector(".connector-line");
            if (path) {
                activeTransitionTimeline.fromTo(
                    path,
                    { strokeDashoffset: 0 },
                    {
                        strokeDashoffset: -12,
                        duration: 1.5,
                        ease: "linear",
                        repeat: 2,
                        overwrite: "auto",
                    },
                    0.2
                );
            }
        }

        const tier2Content = tier2El?.querySelector(".tier2__content");
        if (tier2Content) {
            activeTransitionTimeline.fromTo(
                tier2Content,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" },
                0.1
            );
        }

        if (showAdvanced) {
            const tier3Content = tier3El?.querySelector(".tier3__content");
            if (tier3Content) {
                activeTransitionTimeline.fromTo(
                    tier3Content,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" },
                    0.15
                );
            }
        }

        previousStep = newStep;
    }

    $effect(() => {
        if (!isInteractive || !autoplay || stepsWithIcons.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            currentStep = (currentStep + 1) % stepsWithIcons.length;
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    });

    $effect(() => {
        animateStepChange(currentStep);
    });

    function setActiveStep(index) {
        if (!isInteractive || stepsWithIcons.length === 0) {
            return;
        }

        const nextIndex = Math.min(
            stepsWithIcons.length - 1,
            Math.max(0, index),
        );

        if (nextIndex === currentStep) {
            return;
        }

        autoplay = false;
        currentStep = nextIndex;
    }

    function toggleAdvanced() {
        showAdvanced = !showAdvanced;
        autoplay = false;
    }

    function handleNodeClick(event) {
        if (!isInteractive) {
            return;
        }

        const stepIndex = event.currentTarget?.dataset?.step;
        if (stepIndex === undefined) {
            return;
        }

        const parsed = Number(stepIndex);
        if (Number.isNaN(parsed)) {
            return;
        }

        setActiveStep(parsed);
    }

    function handleNodeKeydown(event) {
        if (event.key !== "Enter") {
            return;
        }

        handleNodeClick(event);
    }

    function handleNodeMouseEnter(event) {
        if (!isInteractive || !gsapInstance) return;

        const node = event.currentTarget;
        const isActive = node.classList.contains("active");
        if (isActive) return;

        const rect = node.querySelector(".node-rect");

        gsapInstance.to(rect, {
            attr: {
                "stroke-opacity": 0.5,
                "stroke-width": 1.5
            },
            duration: 0.18,
            ease: "power2.out",
            overwrite: "auto",
        });
    }

    function handleNodeMouseLeave(event) {
        if (!isInteractive || !gsapInstance) return;

        const node = event.currentTarget;
        const isActive = node.classList.contains("active");
        if (isActive) return;

        const rect = node.querySelector(".node-rect");

        gsapInstance.to(rect, {
            attr: {
                "stroke-opacity": 0.28,
                "stroke-width": 1.2
            },
            duration: 0.18,
            ease: "power2.out",
            overwrite: "auto",
        });
    }

    function hideSourceElements(elements) {
        elements.forEach((el) => {
            const tagName = el.tagName?.toLowerCase();
            if (tagName === "workflow-step" || tagName === "workflow-styles") {
                el.style.display = "none";
                el.setAttribute("aria-hidden", "true");
            }
        });
    }

    onMount(() => {
        const root = flowchartEl?.getRootNode?.();
        const hostElement = root && "host" in root ? root.host : null;

        if (!hostElement) {
            console.error("workflow-viz: Could not access host element");
            return;
        }

        const sourceContainer = root?.querySelector?.('[data-role="workflow-source"]');
        const slotElement = sourceContainer?.querySelector?.('slot');

        let initialized = false;
        let destroyed = false;

        function initializeWorkflow() {
            if (initialized) return;

            const assignedElements = slotElement?.assignedElements?.({ flatten: true }) ?? [];
            const sourceElements = assignedElements.length > 0
                ? assignedElements
                : Array.from(hostElement.children);

            const { steps, styles } = parseInlineContent(sourceElements);

            if (steps.length === 0) {
                return;
            }

            initialized = true;

            inlineStyles = styles;
            stepsWithIcons = steps.map(step => ({
                ...step,
                icon: loadIcon(step.icon)
            }));

            hideSourceElements(sourceElements);

            if (isInteractive) {
                loadAnimations().then((gsapLib) => {
                    if (destroyed || !gsapLib) return;
                    previousStep = currentStep;
                    requestAnimationFrame(() => {
                        animateNodeEntrance();
                    });
                });
            }
        }

        if (slotElement) {
            slotElement.addEventListener('slotchange', initializeWorkflow);
        }

        requestAnimationFrame(() => {
            initializeWorkflow();
        });

        return () => {
            destroyed = true;
            if (slotElement) {
                slotElement.removeEventListener('slotchange', initializeWorkflow);
            }
        };
    });
</script>

{#if inlineStyles}
    {@html `<style>${inlineStyles}</style>`}
{/if}

<div class="workflow-source" data-role="workflow-source" aria-hidden="true">
    <slot></slot>
</div>

<div class="workflow-wrapper">
    <div class="workflow" class:advanced-visible={showAdvanced}>
        <div class="column column--tier1">
            <svg
                bind:this={flowchartEl}
                class="flowchart"
                viewBox={`0 0 ${flowchartWidth} ${flowchartHeight + topPadding + 24}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="shadow">
                        <feDropShadow
                            dx="0"
                            dy="1.5"
                            stdDeviation="2.2"
                            flood-opacity="0.12"
                        />
                    </filter>
                </defs>

                {#each stepsWithIcons as item, index}
                    {#if index < stepsWithIcons.length - 1}
                        <g data-line={index}>
                            <path
                                d={`M ${getNodeCenter()} ${topPadding + 16 + index * nodeSpacing + nodeHeight / 2} L ${getNodeCenter()} ${topPadding + 16 + (index + 1) * nodeSpacing - nodeHeight / 2}`}
                                stroke="#000000"
                                stroke-opacity="0.12"
                                stroke-width="1.6"
                                stroke-dasharray="5 5"
                                fill="none"
                                class="connector-line"
                            />
                        </g>
                    {/if}

                    {@const NodeIcon = item.icon}
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                    <g
                        data-step={index}
                        class="node"
                        class:active={currentStep === index}
                        class:interactive={isInteractive}
                        data-color={item.color}
                        role={isInteractive ? "button" : undefined}
                        tabindex={isInteractive ? "0" : undefined}
                        onclick={isInteractive
                            ? handleNodeClick
                            : undefined}
                        onkeydown={isInteractive
                            ? handleNodeKeydown
                            : undefined}
                        onmouseenter={isInteractive
                            ? handleNodeMouseEnter
                            : undefined}
                        onmouseleave={isInteractive
                            ? handleNodeMouseLeave
                            : undefined}
                    >
                        <rect
                            x={getNodeX()}
                            y={topPadding +
                                16 +
                                index * nodeSpacing -
                                nodeHeight / 2}
                            width={nodeWidth}
                            height={nodeHeight}
                            rx="18"
                            ry="18"
                            fill="#ffffff"
                            stroke={item.color || "#94a3b8"}
                            stroke-opacity={currentStep === index ? 1 : 0.28}
                            stroke-width={currentStep === index ? 1.8 : 1.2}
                            filter={currentStep === index
                                ? "url(#shadow)"
                                : undefined}
                            class="node-rect"
                        />
                        <foreignObject
                            class="node__foreign"
                            x={getNodeX()}
                            y={topPadding +
                                16 +
                                index * nodeSpacing -
                                nodeHeight / 2}
                            width={nodeWidth}
                            height={nodeHeight}
                        >
                            <div
                                class="node__content"
                                xmlns="http://www.w3.org/1999/xhtml"
                            >
                                <span
                                    class="node__icon"
                                    aria-hidden="true"
                                    style={item.color ? `background: ${item.color}1a; color: ${item.color};` : ''}
                                >
                                    <NodeIcon size={16} />
                                </span>
                                <div class="node__text">
                                    <span class="node__label">{item.label}</span>
                                    {#if item.subtitle}
                                        <span class="node__subtitle">{item.subtitle}</span>
                                    {/if}
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                {/each}
            </svg>
        </div>

        <div
            class="column column--tier2"
            aria-live="polite"
            bind:this={tier2El}
        >
            <div class="tier2__header">
                <div
                    class="tier2__glyph"
                    aria-hidden="true"
                    style={activeStep?.color ? `background: ${activeStep.color}14; color: ${activeStep.color};` : ''}
                >
                    <ActiveIcon size={18} />
                </div>
                <button
                    class="tier2__toggle"
                    class:active={showAdvanced}
                    onclick={toggleAdvanced}
                    aria-label={showAdvanced
                        ? "Hide advanced view"
                        : "Show advanced view"}
                >
                    <Code size={18} />
                </button>
            </div>
            <span class="sr-only">{activeStep?.label}</span>
            <p class="tier2__content">{@html activeStep?.tier2 || ""}</p>
        </div>

        <div
            class="column column--tier3"
            class:visible={showAdvanced}
            bind:this={tier3El}
        >
            <div class="tier3__content">
                <span class="tier3__chip" aria-hidden="true">
                    <Code size={16} />
                </span>
                {@html activeStep?.tier3 || ""}
            </div>
        </div>
    </div>
</div>

<style>
    :host {
        display: block;
        width: 100%;
        font-size: 1rem;
        color: rgba(15, 23, 42, 0.82);
    }

    .workflow-wrapper {
        padding: clamp(0.75rem, 3vw, 1.5rem);
        background: transparent;
        border: none;
        border-radius: 12px;
        overflow-x: auto;
        overscroll-behavior-inline: contain;
        scroll-behavior: smooth;
        scroll-snap-type: inline proximity;
        scroll-padding-inline: clamp(1.5rem, 3vw, 2.25rem);
    }

    .workflow-source {
        display: none !important;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .workflow {
        --column-width: 18.25rem;
        --column-gap: 1.1rem;
        --workflow-columns: 2;
        display: flex;
        gap: var(--column-gap);
        align-items: flex-start;
        justify-content: flex-start;
        width: calc(
            var(--workflow-columns) * var(--column-width) +
                (var(--workflow-columns) - 1) * var(--column-gap)
        );
        margin: 0 auto;
        font-family:
            "ABC Diatype",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        transition:
            gap 0.35s ease,
            width 0.35s ease;
    }

    .workflow.advanced-visible {
        --column-gap: 1.25rem;
        --workflow-columns: 3;
        width: calc(14rem + 2 * var(--column-width) + 2 * var(--column-gap));
    }

    .workflow.advanced-visible .column--tier1 {
        transform: translateX(-0.75rem);
    }

    .workflow.advanced-visible .column--tier2 {
        transform: translateX(-0.35rem);
    }

    .column {
        flex: 0 0 var(--column-width);
        min-width: var(--column-width);
        max-width: var(--column-width);
        width: var(--column-width);
        scroll-snap-align: start;
        transition:
            transform 0.4s ease,
            opacity 0.3s ease;
    }

    .column--tier1 {
        --column-width: 14rem;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .flowchart {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
    }

    .node {
        opacity: 0.1;
        will-change: transform, opacity;
    }

    .node.interactive {
        opacity: 0.6;
        cursor: pointer;
    }

    .node.active {
        opacity: 1;
    }

    .node:focus {
        outline: none;
    }

    .node-rect {
        will-change: stroke-opacity, stroke-width;
    }

    .node__foreign {
        pointer-events: none;
    }

    .node__content {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        height: 100%;
        padding: 0.3rem 0.5rem;
        font-size: 0.82em;
        font-weight: 500;
        color: rgba(15, 23, 42, 0.7);
        letter-spacing: -0.01em;
        box-sizing: border-box;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.9);
        transition:
            background 0.3s ease,
            box-shadow 0.3s ease;
    }

    .node__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 6px;
        background: rgba(15, 23, 42, 0.05);
        color: rgba(15, 23, 42, 0.52);
        will-change: transform;
    }

    .node__icon :global(svg) {
        width: 12px;
        height: 12px;
    }

    .node__text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.05rem;
        min-width: 0;
    }

    .node__label {
        font-family: "ABC Diatype", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 0.85em;
        line-height: 1.3;
        user-select: none;
    }

    .node__subtitle {
        font-size: 0.78em;
        font-weight: 400;
        color: rgba(15, 23, 42, 0.45);
        line-height: 1.2;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .node.active .node__label {
        color: rgba(15, 23, 42, 0.92);
    }

    .node.active .node__subtitle {
        color: rgba(15, 23, 42, 0.6);
    }

    .column--tier2,
    .column--tier3 {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        height: auto;
        box-sizing: border-box;
    }

    .column--tier2 {
        gap: 1rem;
    }

    .column--tier3 {
        background: rgba(248, 250, 252, 0.88);
        border: 1px solid rgba(15, 23, 42, 0.05);
        color: rgba(0, 0, 0, 0.82);
        box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
        overflow: hidden;
        box-sizing: border-box;
        transition:
            flex-basis 0.45s ease,
            min-width 0.45s ease,
            opacity 0.3s ease,
            padding 0.3s ease,
            border 0.3s ease,
            box-shadow 0.3s ease;
    }

    .column--tier3:not(.visible) {
        flex: 0 0 0;
        min-width: 0;
        flex-basis: 0;
        width: 0;
        max-width: 0;
        opacity: 0;
        padding: 0;
        border: 0;
        box-shadow: none;
        pointer-events: none;
    }

    .tier2__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
    }

    .tier2__glyph {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.04);
        color: rgba(15, 23, 42, 0.6);
        transition: transform 0.25s ease;
    }

    .tier2__glyph :global(svg) {
        width: 18px;
        height: 18px;
    }

    .tier2__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        color: rgba(15, 23, 42, 0.5);
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .tier2__toggle:hover {
        background: rgba(15, 23, 42, 0.06);
        color: rgba(15, 23, 42, 0.7);
    }

    .tier2__toggle.active {
        background: rgba(15, 23, 42, 0.08);
        color: rgba(15, 23, 42, 0.8);
    }

    @keyframes breathe {
        0%, 100% {
            box-shadow: 0 0 0 rgba(15, 23, 42, 0);
            background: transparent;
            transform: scale(1);
        }
        50% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15),
                        0 4px 16px rgba(59, 130, 246, 0.25);
            background: rgba(59, 130, 246, 0.08);
            transform: scale(1.03);
        }
    }

    .tier2__toggle:not(.active) {
        animation: breathe 2.2s ease-in-out infinite;
    }

    .tier2__toggle:not(.active):hover {
        animation-play-state: paused;
    }

    .tier2__content {
        font-size: 1em;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.4;
        margin: 0;
    }

    .tier2__content :global(.explanation) {
        font-size: 0.98em;
        color: rgba(15, 23, 42, 0.6);
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
        font-weight: 500;
    }

    .tier2__content :global(.content-block) {
        font-size: 0.95em;
        line-height: 1.6;
        padding: 0.85rem 1rem;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.02);
        border-left: 3px solid rgba(0, 0, 0, 0.1);
        margin: 0;
    }

    .tier2__content :global(.content-block pre) {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
        font-size: 0.9em;
        line-height: 1.5;
        color: rgba(15, 23, 42, 0.8);
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .tier2__content :global(.content-block code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
        font-size: 0.92em;
        background: rgba(0, 0, 0, 0.05);
        padding: 0.15em 0.35em;
        border-radius: 3px;
        color: #8b5cf6;
    }

    .tier3__chip {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.06);
        border: 1px solid rgba(15, 23, 42, 0.08);
        color: rgba(15, 23, 42, 0.55);
    }

    .tier3__content {
        position: relative;
        font-family: "ABC Diatype Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.95em;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.65;
        overflow-x: auto;
        overflow-y: auto;
        max-height: 360px;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
        background: rgba(255, 255, 255, 0.86);
        border-radius: 12px;
        border: 1px solid rgba(15, 23, 42, 0.05);
        padding: 1.3rem 1.15rem 1.15rem;
        padding-top: 1.85rem;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
        box-sizing: border-box;
    }

    .tier3__content::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .tier3__content::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
    }

    .tier3__content::-webkit-scrollbar-thumb {
        background: rgba(15, 23, 42, 0.12);
        border-radius: 3px;
        transition: background 0.2s ease;
    }

    .tier3__content::-webkit-scrollbar-thumb:hover {
        background: rgba(15, 23, 42, 0.2);
    }

</style>
