import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORY_PROMPTS: Record<string, string> = {
  Autoridade:
    "Você é um especialista em marketing para redes sociais. Crie conteúdo que posicione o profissional como autoridade no assunto. Tom: confiante, profissional, inspirador.",
  Educativo:
    "Você é um especialista em marketing educativo. Crie conteúdo que ensine algo valioso ao público. Tom: didático, acessível, prático.",
  Executivo:
    "Você é um especialista em marketing corporativo. Crie conteúdo para posicionamento executivo. Tom: sofisticado, estratégico, visionário.",
  Processo:
    "Você é um especialista em marketing de processos. Crie conteúdo que mostre metodologias e processos. Tom: organizado, metódico, claro.",
  Inovação:
    "Você é um especialista em marketing de inovação. Crie conteúdo sobre tendências e novidades. Tom: vanguardista, entusiasmado, tecnológico.",
  Gestão:
    "Você é um especialista em marketing de gestão. Crie conteúdo sobre liderança e gestão. Tom: assertivo, empático, experiente.",
  Datas:
    "Você é um especialista em marketing sazonal. Crie conteúdo para datas comemorativas. Tom: festivo, engajador, emocional.",
};

export interface GeneratedText {
  title: string;
  subtitle: string;
  hook: string;
  description: string;
  cta: string;
}

export async function generatePostText(
  category: string,
  topic?: string,
  count: number = 3
): Promise<GeneratedText[]> {
  const systemPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS["Autoridade"];

  const userPrompt = `Gere ${count} variações de texto para um post de Instagram na categoria "${category}".
${topic ? `Tema: ${topic}` : "Escolha um tema relevante para a categoria."}

Para cada variação, retorne um JSON com:
- hook: frase de abertura curta e impactante (máx 10 palavras)
- title: título principal em destaque (máx 8 palavras)
- subtitle: subtítulo complementar (máx 15 palavras)
- description: texto descritivo (máx 30 palavras)
- cta: chamada para ação (máx 8 palavras)

Retorne APENAS um array JSON válido com ${count} objetos. Sem markdown, sem explicação.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "[]";

  try {
    return JSON.parse(content);
  } catch {
    return [
      {
        title: "Erro ao gerar texto",
        subtitle: "Tente novamente",
        hook: "Ops!",
        description: "Não foi possível gerar o texto. Por favor, tente novamente.",
        cta: "Gerar novamente",
      },
    ];
  }
}
