# Agents explained

Everyone is talking about AI agents. Frontier labs have put out tooling for [developers](https://openai.com/index/new-tools-for-building-agents/) [to](https://openai.com/index/introducing-agentkit/) [build](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) [them](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk). 2025 has been called the [year of agents](https://x.com/gdb/status/1923541152508281329), they are the subject of widespread [social media commentary]( https://x.com/karpathy/status/1979644538185752935) and blow-your-mind [products](http://youtube.com/watch?v=6eBSHbLKuN0) and [demos](https://www.youtube.com/live/8UWKxJbjriY?si=XpSQ1-oMWalBUC4f&t=835).

What are agents exactly? How are they built and trained? How are they related to previous tech like large language models (LLM) or chatbots?

An agent is an LLM trained to interact with the outside world, plus a code environment that allows it to do so. It acts through predicting text that activates so-called [tools](https://ai.meta.com/research/publications/toolformer-language-models-can-teach-themselves-to-use-tools/), like a programmer would use an API. Tools are functions in a programming language that accept arguments, perform some meaningful logic, and return outputs. The agent achieves its task by interleaving multiple rounds of reasoning (summarizing, making a plan, taking decisions) and tool calling. Tools can do two things: first, get useful information to inform decision making or return to the user; second, they can change the state of the world, like when ordering groceries or sending an email.

<script src="https://cdn.jsdelivr.net/gh/adaptive-ml/blog-components/components/agent-viz.js"></script>
<agent-workflow></agent-workflow>

---

### How does it work?

Suppose you are in Copenhagen for a few days and asking an agent to plan a weekend trip.

It will look at the weather for the next days, use this to search for activities in the city, check websites to learn what events are happening and opening times, and finally suggest a nice plan for you.

[show overall flow, same as hero? maybe show the final output in the image]

First, your agent will start planning its research. This is similar to the way reasoning models approach a complex problem by decomposing it in a few steps.

[show plan]

The agent will then execute its plan, getting the information it needs from the tools it’s executing. But the only thing LLMs can read are [tokens](), the individual numbers that encode text. How are the are tools, the plan, the past context given to the model to read as tokens, and how do we run tools, plan or respond to the user from token output? Agents are similar to chatbots, where conversation history is kept as a list of *turns* with associated roles (system, user, assistant).

Tool names and definitions are added to the system turn, so the model has them in context and knows when to use them. User turns will encode user queries, reasoning and planning will be encoded as an assistant turn, and tool [calls and](https://huggingface.co/docs/transformers/main/en/chat_templating) responses will each get their own specific turn type. To convert from a list of turns to a sequence of tokens, the application will use the model’s [chat template](https://huggingface.co/docs/transformers/main/en/chat_templating), a specialized piece of code shipped with the model.

[show an image of flattening turns into tokens]

The format depends on how the model was trained, but this usually involves separating turns with special tokens and annotating the turn type at the beginning. Another special token (the end-of-turn token) is used to signal to the program running the agent that the LLM should stop generating, at which point the user should be queried or tools should be executed. 

Tool turns should be formatted as structured outputs (eg a dictionary in JSON format), and parsed by the app running the agent. The fields in this JSON are used to determine which arguments should be used for execution. In our example, the weather tool takes in one argument:  location, as text input. Tool invocation works as so:

- The model predicts the name of the tool and all arguments,
- The end-of-turn token is detected,
- The app executes the tool, calling an external weather API,
- And returns the result as part of a tool response turn.

[illustration (maybe several?)]

The weather looks sunny and warm this weekend, so the model could search for outdoor activities like how to best bike around the city. To get route and landmark ideas, or local events, the agent can use an internet search tool and access the content of webpages as a result.

[search tool illustration]

After a few additional searches the model will have seen enough content to give you a few alternatives on how to best enjoy the city.

[show the final answer]

You might have also heard about MCPs in the context of AI agents. MCP (Model Context Protocol) is a standard that allows developers to define tools for their application in a common format. It is a commonly agreed upon way of defining tools for agents, for any application, whether that be calendars, web searches, databases, or workplace software like Slack.

---

### Why does it work now?

Agents are a pretty old concepts. The term originally comes from old-school reinforcement learning (RL) research [10] and is used as a general term for any entity interacting with an environment to maximize some score. Agents understood as personal assistants that can perform computer tasks for you also date back a while [11 Universe project], but for them to work you needed to build a layer of general understanding of the world. This has been unlocked by the increasing capabilities of LLMs trained on the entire internet. Good base LLMs are not enough however.

For the complex workflows that tool calling models need to handle, they need specific capabilities that are not found in internet-scale pretraining datasets. At a basic level, the LLM needs to respect the format required by the prompt, and the ability to write structured output without syntax errors. At a higher level, the model needs to have reasoning capabilities, such as the ability to decompose a complex task into subtasks. And finally, the model needs to have (harder-to-define) *agentic* capabilities that allow it to act effectively and autonomously, such as

- Knowing when it has enough information to make a decision based on context,
- Being able to backtrack when it is going in the wrong direction,
- Enough flexibility to follow its plan while taking new information into account,
- The ability to work through detailed plans and long context without getting confused or lost.

This is not training you can perform by imitating existing data, as pretraining and supervised fine tuning (SFT) do:  this data does’t really exist! If you want to create it, it is hard to collect such data at scale in a format models can use. This is why agent training is mostly done with reinforcement learning. Since RL allows you to learn from experience coupled with positive or negative feedback, models can generate their own data and the feedback teaches them what to pursue or avoid.

[example of positive and negative examples]

RL is very effective at punishing models that respond in the wrong format. It has also been instrumental in teaching models how to reason [12 o1 13 deepseek]: reasoning ability naturally emerges from the combination of chain-of-thought prompting and RL training. RL also reinforces agentic capabilities, since these hard-to-define abilities are useful to complete tasks and ultimately increase rewards. Today, virtually all LLM releases (whether frontier or open-source [14 qwen 15 kimi 16 llama]) include an extensive agentic (tool-calling) training phase done with reinforcement learning.

---

### Personalized agents will learn from your context (or sth)

LLM-powered agents have seen impressive and sustained progress in the past year, as seen in the sort of software tasks they can perform on their own [6 cc, 7 codex], at increasingly long time scales [17 metr]. 

[metr graph?]

They excel at using open-source tools in general-purpose contexts; however they still struggle to integrate very bespoke contexts and tools. Making more personalized agents that can adapt to your environment will take additional work, and reinforcement learning will have a central work in it.

To learn more about how this works, check out adaptive-ml.com