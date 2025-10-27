export const workflowSteps = [
    {
        id: "user-query",
        label: "User Query",
        subtitle: "Plan a weekend trip...",
        color: "#10b981",
        icon: "User",
        tier2: `<div class="explanation">The user provides a query.</div><div class="content-block content-block--user">"Plan a weekend trip in Copenhagen."</div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-user">user</span>
Plan a weekend trip in Copenhagen<span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "thinking",
        label: "Thinking",
        subtitle: "I need to first...",
        color: "#f59e0b",
        icon: "Ai",
        tier2: `<div class="explanation">The model generates reasoning to analyze the problem and plan tool calls.</div><div class="content-block content-block--thinking">To plan a weekend trip, I need weather information and activity recommendations. I'll use <code>get_weather</code> to check conditions, then <code>web_search</code> for activities.</div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
<span class="role-thinking">&lt;think&gt;</span>
To plan a weekend trip, I need weather information and activity recommendations. I'll use <span class="role-tool">get_weather</span> to check conditions, then <span class="role-tool">web_search</span> for activities.
<span class="role-thinking">&lt;/think&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "get-weather",
        label: "Weather Tool",
        subtitle: "Get weather...",
        color: "#8b5cf6",
        icon: "BuildTool",
        tier2: `<div class="explanation">The agent issues a tool call with function name and arguments.</div><div class="content-block content-block--tool"><pre>{
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
{<span class="syntax">"temperature":</span> 20, <span class="syntax">"condition":</span> "Partly Cloudy", <span class="syntax">"humidity":</span> 65, <span class="syntax">"wind_speed":</span> 12, <span class="syntax">"location":</span> "Copenhagen, Denmark", <span class="syntax">"unit":</span> "celsius"}
<span class="role-tool">&lt;/tool_response&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "web-search",
        label: "Search Tool",
        subtitle: "Search web...",
        color: "#8b5cf6",
        icon: "BuildTool",
        tier2: `<div class="explanation">The agent issues another tool call.</div><div class="content-block content-block--tool"><pre>{
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
{<span class="syntax">"results":</span> [{<span class="syntax">"title":</span> "Copenhagen Weekend Guide", <span class="syntax">"snippet":</span> "Visit Tivoli Gardens, stroll through Nyhavn, explore Rosenborg Castle, or bike the city center."}], <span class="syntax">"search_query":</span> "weekend activities Copenhagen"}
<span class="role-tool">&lt;/tool_response&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>`,
    },
    {
        id: "final-response",
        label: "Final Response",
        subtitle: "Here is a plan...",
        color: "#06b6d4",
        icon: "Chat",
        tier2: `<div class="explanation">The agent provides the weekend plan.</div><div class="content-block content-block--response">"Copenhagen will be 20°C and partly cloudy this weekend. I recommend Tivoli Gardens, Nyhavn waterfront, or Rosenborg Castle."</div>`,
        tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
Copenhagen will be 20°C and partly cloudy this weekend. I recommend Tivoli Gardens, Nyhavn waterfront, or Rosenborg Castle.<span class="syntax">&lt;|im_end|&gt;</span>`,
    },
];

// Alternative step for formatting error example
export const formattingErrorStep = {
    id: "get-weather",
    label: "Weather Tool",
    subtitle: "Get weather...",
    color: "#8b5cf6",
    icon: "BuildTool",
    tier2: `<div class="explanation">The agent issues a tool call with function name and arguments.</div><div class="content-block content-block--tool"><pre>{
  "name": "get_weather",
  "arguments": {
    "location": "Copenhagen, Denmark",
    "unit": "celsius"
  }
}</pre></div>`,
    tier3: `<span class="syntax">&lt;|im_start|&gt;</span><span class="role-response">assistant</span>
<span class="role-tool">&lt;tool_call&gt;</span>
{
  "name": "get_weather",
  "arguments": "<span style="text-decoration: wavy underline red;">Copenhagen</span>"
}
</span><span class="role-tool">&lt;/tool_call&gt;</span><span class="syntax">&lt;|im_end|&gt;</span>

<span style="color: red; font-style: italic;">This tool call uses the wrong format and parsing will fail!</span>`,
};

export const workflowStyles = `
.tier3__content .role-user {
  color: var(--color-user, #10b981);
}

.tier3__content .role-thinking {
  color: var(--color-thinking, #f59e0b);
}

.tier3__content .role-tool {
  color: var(--color-tool, #8b5cf6);
}

.tier3__content .role-response {
  color: var(--color-response, #06b6d4);
}

.tier3__content .syntax {
  color: var(--color-syntax, #94a3b8);
}
`;
