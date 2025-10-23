# Agents explained

Everyone is talking about AI agents. Frontier labs have put out tooling for [developers](https://openai.com/index/new-tools-for-building-agents/) [to](https://openai.com/index/introducing-agentkit/) [build](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) [them](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk). 2025 has been called the [year of agents](https://x.com/gdb/status/1923541152508281329), they are the subject of widespread [social media commentary]( https://x.com/karpathy/status/1979644538185752935) and blow-your-mind [products](http://youtube.com/watch?v=6eBSHbLKuN0) and [demos](https://www.youtube.com/live/8UWKxJbjriY?si=XpSQ1-oMWalBUC4f&t=835).

What are agents exactly? How are they built and trained? How are they related to previous tech like large language models (LLM) or chatbots?

<script src="../../components/agent-viz.js"></script>
<agent-workflow></agent-workflow>

An agent is an LLM trained to interact with the outside world, plus a code environment that allows it to do so. It acts through predicting text that activates so-called <span class="agent-tool">tools</span>, like a programmer would use an API. Tools are functions in a programming language that accept arguments, perform some meaningful logic, and return outputs. The agent achieves its task by interleaving multiple rounds of <span class="agent-thinking">reasoning</span> (summarizing, making a plan, taking decisions) and <span class="agent-tool">tool calling</span>. Tools can do two things: first, get useful information to inform decision making or return to the user; second, change the state of the world, like when ordering groceries or sending an email.

### How does it work?

Suppose you are in Copenhagen for a few days and asking an agent to plan a weekend trip. In response to <span class="agent-user">your query</span>, it will <span class="agent-thinking">reason</span> about your question and the information it needs, <span class="agent-tool">look at the weather</span> for the next days, use the result to <span class="agent-tool">search</span> for activities in the city, and finally <span class="agent-response">suggest a nice plan for you</span>.

First, your agent will start planning its research by leveraging the available tools it can access. This is similar to the way [reasoning](https://openai.com/o1/) [models](https://huggingface.co/deepseek-ai/DeepSeek-R1) approach a complex problem by decomposing it in a few steps.

<agent-workflow interactive="false" step="1" expanded="false"></agent-workflow>
<!-- 
<span class="agent-user">user</span>
<span class="agent-thinking">thinking</span>
<span class="agent-tool">tool</span>
<span class="agent-response">response</span>
<span class="agent-syntax">syntax</span> -->

The agent will then execute its plan. How does the LLM do it? The only thing LLMs can read are [tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them), the individual components that encode strings of text. We need a way to translate tool information and calls to a list of tokens. In agents, this is done in a similar way as with chatbots, where conversations are encoded a list of *turns* with associated roles (system, <span class="agent-user">user</span>, <span class="agent-thinking">assistant</span>). In the case of tool-calling agents, we will add additional <span class="agent-tool">tool</span> and <span class="agent-tool">tool response</span> turn types.

Tool names and definitions are added to the system turn, so the model has them in context and knows when to use them. <span class="agent-user">User turns</span> will encode user queries, reasoning will be encoded as an <span class="agent-thinking">assistant turn</span>, and tool [calls](https://huggingface.co/docs/transformers/main/en/chat_templating) and responses will each get their own specific turn type. To convert from a list of turns to a sequence of tokens, the application will use the model’s [chat template](https://huggingface.co/docs/transformers/main/en/chat_templating), a specialized piece of code [shipped with the model](https://huggingface.co/Qwen/Qwen3-4B/tree/main).

<agent-workflow interactive="false" step="1" expanded="true"></agent-workflow>

The format depends on how the model was trained, but this usually involves separating turns with special tokens and annotating the turn type at the beginning (<span class="agent-user">user</span>, <span class="agent-thinking">assistant</span>, <span class="agent-tool">tool</span>, <span class="agent-response">response</span>). Another special token (the <span class="agent-syntax">end-of-turn</span>) is used to signal to the program running the agent that the LLM should stop generating, at which point the user should be queried or tools should be executed. 

<span class="agent-tool">Tool turns</span> should be formatted as structured outputs (eg a dictionary in [JSON](https://en.wikipedia.org/wiki/JSON) format), and parsed by the app running the agent. The fields in this JSON are used to determine which arguments should be used for execution. In our example, the weather tool takes in one argument: location, as text input. Tool invocation works like this:

- The model predicts the name of the tool and all arguments,
- The end-of-turn token is detected,
- The app executes the tool, calling an external weather API,
- And returns the result as part of a tool response turn.

<agent-workflow interactive="false" step="2" expanded="true"></agent-workflow>

The weather looks sunny and warm this weekend, so the model could search for outdoor activities like how to best bike around the city. To get route and landmark ideas, or local events, the agent can use an internet search tool and access the content of webpages as a result.

<agent-workflow interactive="false" step="3" expanded="true"></agent-workflow>

After a few additional searches the model will have seen enough content to give you a few alternatives on how to best enjoy the city.

<agent-workflow interactive="false" step="4" expanded="true"></agent-workflow>

You might have also heard about MCPs in the context of AI agents. MCP ([Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)) is a standard that allows developers to define tools for their application in a common format. It is a commonly agreed upon way of defining tools for agents, whether that be access to [calendar apps](https://mcpservers.org/servers/Shameerpc5029/google-calendar-mcp), [web searches](https://github.com/pskill9/web-search), [databases](https://github.com/crystaldba/postgres-mcp), or actions with workplace software like [Slack](https://mcp.so/server/slack) or [Linear](https://linear.app/docs/mcp).

### Why does it work now?

Agents are pretty old concepts. The term originally comes from [old-school](https://mitpress.mit.edu/9780262039246/reinforcement-learning/) reinforcement learning (RL) research and is used as a general term for any entity acting autonomously in an environment to maximize some score. A prominent example before the LLM era is [AlphaGo](https://deepmind.google/research/projects/alphago/). Agents understood as personal assistants that can perform computer tasks for you also [date back to that era](https://openai.com/index/universe/), but for them to work you need to build a layer of general understanding of the world. This has been unlocked by the increasing capabilities of LLMs trained on the entire internet. Good base LLMs, however, are not enough.

For the complex workflows that tool calling models need to handle, they need specific capabilities that are not found in internet-scale pretraining datasets. At a basic level, the LLM needs to **respect the format** required by the prompt, like the ability to write structured output without syntax errors. At a higher level, the model needs to have **reasoning capabilities**, such as the ability to decompose a complex task into subtasks. And finally, the model needs (harder-to-define) **agentic** capabilities that allow it to act effectively and autonomously, such as:

- Knowing when it has enough information to make a decision based on context,
- Being able to backtrack when it is going in the wrong direction,
- Enough flexibility to follow its plan while taking new information into account,
- The ability to work through detailed plans and long context without getting confused or lost.

You can't get this by imitating existing data, as pretraining and supervised fine tuning (SFT) do: this data does’t really exist! If you want to create it, it is hard to collect such data at scale in a format models can use. This is why agent training is mostly done with reinforcement learning. Since RL allows you to learn from experience, models can generate their own data and the feedback teaches them what to pursue or avoid.

<!-- TODO get the  -->
<agent-workflow interactive="false" step="3" expanded="true"></agent-workflow>

RL is very effective at punishing models that respond in the wrong format. It has also been instrumental in [teaching](https://openai.com/o1/) [models](https://arxiv.org/abs/2501.12948) how to reason: reasoning ability [naturally emerges](https://www.philschmid.de/mini-deepseek-r1) from the combination of [chain-of-thought prompting](https://www.promptingguide.ai/techniques/cot) and RL training. RL also reinforces agentic capabilities, since these abilities are useful to complete tasks and ultimately increase rewards. Today, virtually all LLM releases (whether frontier or [open-source](https://arxiv.org/pdf/2505.09388)) include an extensive agentic (tool-calling) RL training phase.

### Next: agents will learn from your context

LLM-powered agents have seen impressive and sustained progress in the past year, as seen in the sort of software tasks they can perform on their own. [METR](https://metr.org/) documents the [average time it takes for a human](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) to perform tasks that agents are mastering over time, and this is growing exponentially:

![METR](../screenshots/metr.png)

Today's agents excel at using open-source tools in general-purpose contexts; however they still struggle to integrate into very specific environments and use-case specific knowledge. Making more personalized assistants that can adapt to *your* task will take additional work, and reinforcement learning will have a central place in it.

To learn more about how this works, check out [our work with agents](https://www.adaptive-ml.com/).