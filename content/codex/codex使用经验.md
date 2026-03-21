---
title: 'codex使用经验'
description: 'codex使用经验'
date: '2026-03-19'
category: 'codex'
tags: ['codex', 'chatgpt']
image: ''
---

链接：https://linux.do/t/topic/1427711

> 作者：@heidi | 2026-01-11 04:05

我是从codex cli出来就开始使用的，现在工作上完全使用codex。我觉得codex并没有说的这么差而且只要用好基本能解决所有问题。
下面是一些基本情况大家了解一下
1、机器是macboompro m1 max
2、使用语言为java开发都是web相关的项目(最近在学rust)
3、从今年a÷出过公开敌对中国事件后我就没使用claude code了，账号我也发邮件让他们删除了
4、codex我只使用cli，插件没用过，一般都是在vs中删除多余的会话
看过贴吧很多帖子与问题示例后觉得很多人使用不好的原因是对模型缺乏一个基本的了解，所有我先给大家介绍一些模型的基本知识
一、模型的数据是哪里来的

> 公开可获取的互联网文本、技术博客、论坛、文档网站、百科内容、说明文档、博客文章、开源代码(github)、额外授权的书籍、文档、人工清晰构造的高质量样本(比如在强化学习和标注数据阶段模型公司就会出一些问题然后邀请专家来为这个问题编写高质量的回答

二、token是什么
> 模型内部用于计算的最小文本单元，token 的切分由 tokenizer 决定，与自然语言的词法规则不完全一致(大家可以通过这个网站去体验一下https://tiktokenizer.f2api.com)

三、一个模型产生的大致阶段
> 1、预训练阶段
这一阶段是训练成本最高的，大模型训练的费用大部分都是花费在这个上面
预训练使用的是大量弱结构数据，包括自然语言与代码混合语料。数据不以任务、指令、问答为单位而是以连续文本流的形式输入。模型看到的只是token序列，这一阶段模型主要训练结构建模能力(语言语法、代码语法、嵌套结构、长程依赖关系)、 统计语义关联(哪些概念常一起出现，哪些模式在特定上下文中更高概率成立) 、跨域泛化能力(不同语言、不同编程语言、不同写作风格之间的共享模式)。预训练模型不知道自己在回答问题不具备帮助用户解决问题不区分真实与虚假，只区分哪些token常见与罕见
2、标注训练
> 使用人工编写的高质量样本对模型进行监督训练，这些样本通常以指令、问题、代码需求等形式出现，并配有明确的理想回答。具体可参考openai的这篇论文https://arxiv.org/pdf/2203.02155 (3.4章节)
这一阶段的核心作用是约束模型的输出行为，让模型从单出的对互联网数据回忆续写文本转变为尝试按人类指令完成任务。标注训练本身并不显著增加新知识，而是让模型用已有知识解决用户的具体问题。
3、强化学习
在标注训练基础上，通过让人类对多个模型回答进行排序，训练奖励模型，再用强化学习算法调整主模型的输出概率分布。强化学习降低胡编概率、提升回答一致性，并强化安全边界与拒答行为用于调整输出倾向

上面这些内容了解一下就行，我自己也是懂了个皮毛所以里面肯定有很多错误。具体信息可以去看Andrej Karpathy的视频
https://www.youtube.com/watch?v=7xTGNNLPyMI
b站的飞天闪客也可稍微看一下
了解了这些后我们可以简单将大模型的一个会话抽象理解成一个持续输出的一维的token数组，你在上下文的输入会影响这次会话中模型的输出而且这个影响会发生的很快，当你发现模型的输出开始出现问题或者风格不是需要的最好检查一下你输入了什么，当然你也可以在发现问题时直接纠正，将他改造成你喜欢的样子。推荐在工作的工程中尽量减少语气化的输入(你认为我在跟你嘻嘻哈哈么？我看起来现在是想跟你搞七捻三么)
毁灭吧我累了，猜猜我按下这个按钮会发生什么 :upside_down_face:
![image|490x104](https://cdn3.linux.do/original/4X/e/8/2/e82509826a24a529e47b75e729dd163b1b847531.png)

了解了这些你大概就明白为什么你的模型总是不办事或者办事办的乱七八糟的，当然和模型本身的能力也是有关系的
接线来给大家介绍一下codex cli
> 这是一个code agent你可以在本地或者ide插件中去使用，它能够使用内置工具帮助你从0开始完成一些编码任务
工程结构
**模型层**
负责理解指令、分析上下文、生成计划与代码，本质是一个经过对齐的代码模型。
**执行层**
负责把模型输出转化为可执行动作，例如：读文件、改代码、运行命令、调用工具，并记录完整执行轨迹。
**环境层**
即你当前的本地仓库或云环境，包括文件系统、git 状态、依赖环境、网络权限等。
Codex 启动时会构建一个指令链，不是简单拼一段 prompt。这个指令链在一次会话（CLI session / exec run）开始时构建完成，之后整个执行过程都基于它运行。
AGENTS.md 是配置规则的核心入口，Codex 会在执行任何任务前，自动搜索并加载 AGENTS.md 文件。这些文件不需要你在 prompt 中显式提到，只要存在，就会被自动纳入上下文窗口。
1. **全局规则（Global）**
* 目录：`~/.codex/`
* 优先级：
  * `AGENTS.override.md`
  * `AGENTS.md`
* 只读取第一个非空文件
2. **项目规则（Project）**
* 从项目根目录开始
* 一直向下走到当前工作目录
* 每一层目录最多加载一个文件，顺序为：
  * `AGENTS.override.md`
  * `AGENTS.md`
  * 备用文件名（如 TEAM_GUIDE.md）
3. **合并规则**
* 所有命中的文件会按目录顺序拼接
* **越靠近当前目录的规则优先级越高**
* 后出现的规则可以覆盖前面的约定
4. **窗口大小与rule截断**
* 所有规则文件会被拼接进模型上下文
* 有最大字节限制（默认 32KB）
* 超过上限后，后续规则不会被继续加载

以上是它默认的执行链，可以自己去配置加载的路径。官方文档中有说我就不详细说了
https://developers.openai.com/codex/guides/agents-md

接下来讲讲MCP
> MCP 是 模型 用来接入外部工具和上下文的统一协议。
它解决的问题是：模型如何在不内嵌能力的前提下，安全、可控地使用外部系统。
我一般将它理解为微服务架构中的一个微服务
我只装了这三个mcp，
**context7**
用来查开源项目的最新文档，模型工作时优先使用的是训练数据有些数据和技术可能太老。
https://github.com/upstash/context7
**drawio**
用来画图，效果不错，只尝试过一次。
https://github.com/lgazo/drawio-mcp-server
**database**
模型在工作时最好能了解你的数据模型，使用这个就可以让他在实现需求时结合数据库中的数据与表结构思考减少因为信息不完整时的错误实现，这个mcp只包含查询功能
https://modelscope.cn/mcp/servers/socialman/database-mcp
![image|690x499](https://cdn3.linux.do/original/4X/4/f/7/4f7741096dc0ff799ee74ed80ec9465c700f130d.png)

接下来说说skill
> 这个东西在我的印象中好像出了很久了，但是站里还是有相当一部分再问，我觉得有点困惑 :upside_down_face:。
skill本质就是将原本需要在agents.md中编写的一些规则抽象成一个单独的文档让模型在执行任务时可以自己根据description判断是否需要读取这些内容。它解决的是agents.md中内容爆炸的问题，agents.md中的内容是第一次启动时才会构建，这样随着上下文的延长他就会离当前的上下文距离越远。skill可以随时重新让模型读取，离当前上下文越近模型执行执行力就越高(当时使用atlas看官方文档时的那个会话一直嘴硬跟我说使用必须手动用命令告诉模型使用`$skill-name`,我后面的测试中是不用的。模型会自己判断加载，当然如果你发现它不遵守也可手动在输入中告诉他遵守这个skill。所以skill的描述不要太接近，相同的内容放在同一个skill中就行了，输入命令如果前方有你的输入记得加空格，命令如果是在最前面就不用)
![image|690x131](https://cdn3.linux.do/original/4X/8/5/8/858d014c4f6598411c1c41e3fafd08da6b2c4ac2.png)
![image|690x147](https://cdn3.linux.do/original/4X/0/7/d/07de8a28997844d72bbd982ac0a626f8ffc4c89d.png)

然后讲讲cli中一些命令
> 我使用过的只用init、review、resume :smiley: 。其他的好像用不到啊
**init**
就是用来初始化你的项目生成agents.md的
这个东西我一般把他放在项目根目录初始化时直接告诉告诉他根据 agent-md-example/agent-init.md 中的规则初始化项目
![image|626x260](https://cdn3.linux.do/original/4X/4/2/5/425eb8d9da0623133e993e126df3dae8487e3d8d.png)
[v2-2025-12-19.zip|attachment](upload://u8V3VfIn7AMeCRM0IYUfftLIupE.zip) (25.9 KB)
这个google-java-style-guide.md我是在网上找的然后整理成md的，是不是google的我也不确定，随便啦。
https://google.github.io/styleguide/javaguide.html
**resume**
用来恢复会话的
**review**
可以让来对比提交、分支、未提交的代码对比检验模型的实现是否正确的
![image|690x224](https://cdn3.linux.do/original/4X/4/c/f/4cf0ae72cc6738194f60c3e799539f9bdb5fd6e5.png)
一般都是用第4个自定义指令，让他明确的只校验当前功能相关的代码也减少一些token消耗，现在review也有额度了，元旦过后就加了。说实话其余的我真没用到过，大家如果需要可以去它官方文档中自行查询
https://developers.openai.com/codex

接下来讲讲一些chatgpt的使用经验吧，说实话现在不用gemini的部分原因就是他的其他产品特别好用，比如会话记忆、自定义风格、自定义gpt。5.2更新后我感觉gpt风格变得越来越油腻和谄媚了，动不动就罗里吧嗦的说一堆废话，还特别喜欢一句话总结。我总结你xxxx :sweat_smile:
**自定义gpt**
![image|690x144](https://cdn3.linux.do/original/4X/c/d/8/cd8dda12dc64f4a54118ae8215e3132eec30228f.png)
这个功能创建和修改目前只支持web，app端可以使用创建好的但是不能修改或创建，他的作用就相当于你自定义一个带系统提示词的会话，这样就不用每次开新会话想让他做一些固定事情是还要跟它解释半天了，你把他理解成一个自定义skill就行比如翻译
![image|690x362](https://cdn3.linux.do/original/4X/8/a/4/8a4b8a464d71e700b5a8a25205b944e49ddf7514.png)
这是我自定义的一个用来专门翻译的，以后我用这个gpt创建一个会话时直接将英文文档给他就行了
![image|690x465](https://cdn3.linux.do/original/4X/b/5/4/b5411b99e80e23fc8d7a73ebfae065790327d170.png)
**自定义风格**
这个我就把我自己的个性化定义提示词给大家参考一下
![image|569x500](https://cdn3.linux.do/original/4X/c/e/5/ce584107615ced1ec566e062eff0813fab56bfb6.png)
> Language & Tone
> Default language: Chinese
> Use technical, engineering-oriented language
> State facts and conclusions only
> No rhetorical or evaluative language
>
> Default Output Rules (Strict)
> Answer directly
> No preamble, no small talk, no evaluation, no opening remarks
> Do not restate the question
> Do not use phrases like “this is a good question”, “let’s first”, “in conclusion”, etc.
> No explanations by default
> Maximum 5 lines unless explicitly requested
>
> Explanation Rules
> Explanations are allowed only if the prompt explicitly includes keywords:
> “why”, “explain”, “reason”, “principle”, “details”, “expand”
> If none of these keywords appear, treat the request as answer-only
>
> Content Constraints
> No tutorial-style writing
> No background, history, or conceptual introductions
> Include only information strictly required to answer the question
> Prefer precise, verifiable technical statements
>
> Optional Trigger Keywords
> “answer only”: output conclusion only
> “engineering perspective”: allow implementation details and trade-offs
> “expand”: allow detailed explanation
>
> Failure Condition
> Any preamble, evaluative language, or unnecessary explanation counts as a failed response

**知识库**
有些论文或者书籍你可以在这里新建一个知识库，然后让模型将内容总结给你，提升信息的接收速度。这里一个知识库后面是一个沙箱环境的linux主机，你所有上传的文件都会保存在这个沙箱环境中
![image|690x467](https://cdn3.linux.do/original/4X/d/8/d/d8d61e1d5c92311b10eedb6426de2faa7149032b.png)
![image|690x330](https://cdn3.linux.do/original/4X/f/2/6/f26e3ff1c48e85b9aa7d591da0d2e1bccd9ad067.jpeg)

兄弟们燃尽了，一滴都没有了。其中说的有些不对的地方麻烦大家给我指正一下。写了几个小时整理这个文档，很多地方怕写不对写了又删好累啊。
这个内容太长了SKILL的分享我就放评论区，都只有SKILL.md没有其他的比如
* scripts
* references
* assets
  因为都不是工具类的skill，然后给大家分享一个获取skill的网站
  https://skillsmp.com
  我觉得在ai中自己写是最符合自己需求的，需要什么就创建什么
  ![image|448x500](https://cdn3.linux.do/original/4X/4/4/7/447ce15db00bb31b9a98cfd991a09124c9bf2bcc.png)
  目前我感觉我的配置codex会存在几个问题，有时他不会遵守先计划再编码的规则直接就开始编码的。还有就是代码的结构有时会有点过度封装

然后就是我基于我目前的skill与配置给大家演示一下效果。从0开始简单的copy一个开源项目
https://github.com/springwolf/springwolf-core?tab=readme-ov-file#about
看看token消耗
codex简单复现项目地址，后端完成时间18分钟，前端完成时间为10分钟。前端我没有任何skill或者agents.md规则效果可能会差一点
https://github.com/littleheid/spring-wolf-demo/tree/main
token消耗前后对比
![codex-limit|690x362](https://cdn3.linux.do/original/4X/c/5/0/c5077bd394bb764482708c653fa7e6f80df4d2a1.png)
![codex-limit2|690x339](https://cdn3.linux.do/original/4X/7/0/b/70b18e6b06ee0e968dea408a4072edd6c859642b.png)


吐槽一下，codex感觉元旦后token消耗变高了，我一周只用5天都快感觉不够用了。以前还能剩下百分之50，现在都只能剩下25了。还有上下压缩的问题，有时看剩余明明有30，它就开始压缩了。不过压缩效果很好，目前看来没有丢失过信息，就是压缩会很慢。