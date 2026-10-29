# Examples

The canonical, validated examples are the real entries in the feature data modules:

- `src/features/questions/data.ts` — representative LLM, Python, and system-design interview guides.
- `src/features/roadmaps/data.ts` — the Python foundations roadmap topic.
- `src/features/blog/data.ts` — the RAG explainer article and sourced news article.

Use those records as examples when adding content. `src/content.validation.test.ts` checks their shape, answer length, references, and relationships. Avoid maintaining duplicate sample records here that can drift from production content.
