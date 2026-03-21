---
title: '理解 Transformer 架构：从注意力机制到大语言模型'
description: '深入解析 Transformer 架构的核心原理，包括自注意力机制、位置编码、多头注意力等关键技术，帮助你从零理解 GPT、BERT 等大语言模型的基础。'
date: '2024-12-15'
category: 'llm'
tags: ['transformer', 'attention', 'llm', 'deep-learning']
image: '/images/transformer-cover.svg'
---

# 理解 Transformer 架构

Transformer 是现代大语言模型的基石架构，由 Google 在 2017 年的论文 "Attention Is All You Need" 中提出。它彻底改变了自然语言处理领域，成为 GPT、BERT、LLaMA 等模型的核心。

## 为什么需要 Transformer？

在 Transformer 出现之前，序列建模主要依赖 RNN（循环神经网络）和 LSTM（长短期记忆网络）。这些模型存在几个关键问题：

1. **顺序处理**：RNN 必须按顺序处理输入，无法并行化
2. **长距离依赖**：难以捕获长序列中的远距离关系
3. **梯度问题**：深层网络中存在梯度消失/爆炸问题

## 自注意力机制（Self-Attention）

自注意力是 Transformer 的核心创新。它允许模型在处理每个位置时，关注输入序列中的所有其他位置。

### 数学公式

注意力函数可以描述为将一个查询（Query）和一组键值对（Key-Value pairs）映射到输出：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

其中：
- $Q$ 是查询矩阵
- $K$ 是键矩阵
- $V$ 是值矩阵
- $d_k$ 是键的维度

### 直觉理解

想象你在阅读一个句子："**猫**坐在垫子上，因为**它**很累。"

当模型处理"它"这个词时，自注意力机制会计算"它"与句子中所有其他词的关联程度。在这个例子中，"它"应该与"猫"有最高的注意力权重。

## 多头注意力（Multi-Head Attention）

为了让模型能同时关注不同类型的信息，Transformer 使用了多头注意力：

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_h)W^O
$$

每个头独立学习不同的注意力模式：

```python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)

        # 线性变换并分头
        Q = self.W_q(query).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)

        # 计算注意力
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn = torch.softmax(scores, dim=-1)
        output = torch.matmul(attn, V)

        # 合并多头
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        return self.W_o(output)
```

## 位置编码（Positional Encoding）

由于 Transformer 不像 RNN 那样天然包含位置信息，需要通过位置编码来注入位置信息：

$$
PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

$$
PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

::callout{type="tip"}
现代大语言模型（如 LLaMA）通常使用 **旋转位置编码（RoPE）** 代替原始的正弦位置编码，因为它在处理长序列时表现更好。
::

## Encoder-Decoder 结构

完整的 Transformer 包含编码器和解码器两部分：

| 组件 | 作用 | 代表模型 |
|------|------|---------|
| Encoder | 将输入序列编码为上下文表示 | BERT |
| Decoder | 自回归生成输出序列 | GPT |
| Encoder-Decoder | 序列到序列转换 | T5, BART |

## 从 Transformer 到 LLM

现代大语言模型的发展路径：

1. **BERT（2018）**：仅使用 Encoder，双向注意力，适合理解任务
2. **GPT-2（2019）**：仅使用 Decoder，单向注意力，适合生成任务
3. **GPT-3（2020）**：规模化 Decoder，展示了涌现能力
4. **ChatGPT（2022）**：结合 RLHF 进行人类偏好对齐
5. **GPT-4（2023）**：多模态能力

::callout{type="info"}
理解 Transformer 架构是学习现代 AI 的基础。建议先掌握线性代数和概率论基础，再深入学习注意力机制的细节。
::

## 进一步学习

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - 原始论文
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) - 可视化教程
- [Harvard NLP - The Annotated Transformer](https://nlp.seas.harvard.edu/2018/04/03/attention.html) - 带代码注释的实现
