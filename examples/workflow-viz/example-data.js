/**
 * Sample workflow steps demonstrating the WorkflowViz component data structure
 *
 * Each step object should have:
 * - id: Unique identifier for the step
 * - label: Display name shown in the visualization
 * - subtitle: Preview text shown in collapsed state
 * - color: Hex color code for this step
 * - icon: Carbon icon name (PascalCase, e.g., "User", "Ai", "BuildTool")
 * - tier2: HTML content for the description/detail view
 * - tier3: HTML content for the technical/code view (optional)
 */

export const exampleSteps = [
    {
        id: "user-query",
        label: "User Query",
        subtitle: "Plan a weekend trip...",
        color: "#10b981",
        icon: "User",
        tier2: `<div class="explanation">The user provides a natural language query.</div><div class="content-block content-block--user">"Plan a weekend trip in Copenhagen."</div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-user">user</span>
Plan a weekend trip in Copenhagen<span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "thinking",
        label: "Thinking",
        subtitle: "I need to first check...",
        color: "#f59e0b",
        icon: "Ai",
        tier2: `<div class="explanation">The model generates internal reasoning to analyze the problem and plan its approach.</div><div class="content-block content-block--thinking">To plan a weekend trip, I need weather information and activity recommendations. I'll use <code>get_weather</code> to check conditions, then <code>web_search</code> for activities.</div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
<span class="role-thinking">&lt;think&gt;</span>
To plan a weekend trip, I need weather information and activity recommendations. I'll use <span class="role-tool">get_weather</span> to check conditions, then <span class="role-tool">web_search</span> for activities.
<span class="role-thinking">&lt;/think&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "get-weather",
        label: "Weather Tool",
        subtitle: "Checking conditions...",
        color: "#8b5cf6",
        icon: "BuildTool",
        tier2: `<div class="explanation">The agent issues a tool call with function name and structured arguments.</div><div class="content-block content-block--tool"><pre>{
  "name": "get_weather",
  "arguments": {
    "location": "Copenhagen, Denmark",
    "unit": "celsius"
  }
}</pre></div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
<span class="role-tool">&lt;tool_call&gt;</span>
{<span class="syntax">"name":</span> <span class="role-tool">"get_weather"</span>, <span class="syntax">"arguments":</span> {<span class="syntax">"location":</span> "Copenhagen, Denmark", <span class="syntax">"unit":</span> "celsius"}}
<span class="role-tool">&lt;/tool_call&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>

<span class="syntax">&lt;|im_start|&gt;</span><span class="syntax">system</span>
<span class="role-tool">&lt;tool_response&gt;</span>
{<span class="syntax">"temperature":</span> 20, <span class="syntax">"condition":</span> "Partly Cloudy", <span class="syntax">"humidity":</span> 65, <span class="syntax">"wind_speed":</span> 12}
<span class="role-tool">&lt;/tool_response&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "web-search",
        label: "Search Tool",
        subtitle: "Finding activities...",
        color: "#8b5cf6",
        icon: "BuildTool",
        tier2: `<div class="explanation">The agent calls another tool to gather activity recommendations.</div><div class="content-block content-block--tool"><pre>{
  "name": "web_search",
  "arguments": {
    "query": "weekend activities Copenhagen"
  }
}</pre></div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
<span class="role-tool">&lt;tool_call&gt;</span>
{<span class="syntax">"name":</span> <span class="role-tool">"web_search"</span>, <span class="syntax">"arguments":</span> {<span class="syntax">"query":</span> "weekend activities Copenhagen"}}
<span class="role-tool">&lt;/tool_call&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>

<span class="syntax">&lt;|im_start|&gt;</span><span class="syntax">system</span>
<span class="role-tool">&lt;tool_response&gt;</span>
{<span class="syntax">"results":</span> [{<span class="syntax">"title":</span> "Copenhagen Weekend Guide", <span class="syntax">"snippet":</span> "Visit Tivoli Gardens, stroll through Nyhavn..."}]}
<span class="role-tool">&lt;/tool_response&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "final-response",
        label: "Final Response",
        subtitle: "Here is a plan...",
        color: "#06b6d4",
        icon: "Chat",
        tier2: `<div class="explanation">The agent provides the final response to the user based on gathered information.</div><div class="content-block content-block--response">"Copenhagen will be 20°C and partly cloudy this weekend. I recommend visiting Tivoli Gardens, strolling through the colorful Nyhavn waterfront, or exploring Rosenborg Castle."</div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
Copenhagen will be 20°C and partly cloudy this weekend. I recommend visiting Tivoli Gardens, strolling through the colorful Nyhavn waterfront, or exploring Rosenborg Castle.<span class="syntax">&lt;|im_end|&gt;</span>`,
    },
];

/**
 * Simplified workflow with fewer steps
 * Good for demonstrating static instances in a compact layout
 */
export const simpleWorkflow = [
    {
        id: "input",
        label: "Input",
        subtitle: "User provides a task",
        color: "#10b981",
        icon: "User",
        tier2: `<div class="explanation">User input</div><div class="content-block content-block--user">"Hello, world!"</div>`,
        tier3: `<span class="role-user">Hello, world!</span>`,
    },
    {
        id: "processing",
        label: "Processing",
        subtitle: "System processes...",
        color: "#f59e0b",
        icon: "Ai",
        tier2: `<div class="explanation">Processing the input</div><div class="content-block content-block--thinking">Analyzing input...</div>`,
        tier3: `<span class="role-thinking">Analyzing input...</span>`,
    },
    {
        id: "output",
        label: "Output",
        subtitle: "Result generated",
        color: "#06b6d4",
        icon: "Chat",
        tier2: `<div class="explanation">Final output</div><div class="content-block content-block--response">"Hello back to you!"</div>`,
        tier3: `<span class="role-response">Hello back to you!</span>`,
    },
];
