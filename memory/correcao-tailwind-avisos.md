---
name: correcao-tailwind-avisos
description: Correção de avisos amarelos do Tailwind CSS v4 no projeto focinho-amigo
metadata:
  type: project
---

Corrigidos avisos `tailwindcss(suggestCanonicalClasses)` substituindo classes arbitrárias de padding (`p-[...]`, `py-[...]`, `px-[...]`), gap (`gap-[...]`) e margens (`mt-[...]`, `mb-[...]`, etc.) por equivalentes canônicos (`p-4`, `py-5`, `gap-3`, etc.) em todos os arquivos `.tsx` do projeto (`AdminMenu`, `PublicationEditor`, `PublicationPreview`, `Publications`, `Login`, `App` e os demais 20 arquivos restantes).

**Por que fizemos:** o VS Code mostrava ~250 avisos amarelos relacionados a classes arbitrárias; a substituição por classes canônicas limpa o painel de diagnósticos sem alterar a configuração do projeto.

**Por que mantivemos os restantes:** cores (`bg-[#2174b7]`, `text-[#ffb800]`), tamanhos específicos (`w-[390px]`, `h-[360px]`), bordas arredondadas (`rounded-[28px]`), sombras (`shadow-[...]`) e fontes (`font-['Inter',...]`) não possuem equivalentes canônicos exatos no Tailwind v4 — substituí-los alteraria o visual ou exigiria configuração de tema que não foi solicitada. Esses avisos permanecem intencionalmente.

**Por que:** preserva visual e comportamento; evita substituições inseguras; build passa.
**Como aplicar:** manter substituições de padding/gap/margin; não forçar equivalentes para cores ou tamanhos arbitrários sem configuração de tema.
