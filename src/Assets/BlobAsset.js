\An interesting observation is that push-back on WC often comes from authors of non-wc frameworks.

This makes sense. If the author believed in web components, they would be building a web component framework.

Now I got into web development late, around 2020. It feels like more experienced developers already made up their minds about web components far before this time. So I can't really speak to the history. But approaching them in 2024, I get the sense that their history is a real curse. If they were first launched in their current state, I think the reception towards them would be different. Using Lit is a good experience! But framework authors complain about the difficulties of implementing them as a compile target. This makes sense, these frameworks are trying to graft their own component model with the lifecycle and quirks of WC's. It's not a surprise that it's painful. It's attempting to merge two very different models.

Ok so let's talk about the most enticing benefit of WC's: interop. Look at Radix for example. It's a React UI library that has been forked to Svelte, Vue, Solid, Angular, and probably more. There is a huge amount of wasted effort going into headless UI components. It would make sense to consolidate that effort into a single library that could work with various authoring methods. In general there is a huge amount of wasted effort. Basically every framework (except one...you know who it is) have embraced SIGNALS as the reactive primitive to build upon. Each with a different API and slightly different implementation, but the same concept in the end...

Imagine being able to choose your preferred authoring style (jsx, angular templates, SFC's, etc) but having access to a shared ecosystem of plugins and components. On the backend, we're working towards this with initiatives like unjs. We have Vite, which has created a shared environment between all JS frameworks (except one....you know who I'm talking about). Yet a shared ecosystem of components remains elusive.

 