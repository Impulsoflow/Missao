# MISSÃO — Instituto Impulso IE™

Instrumento autoral de reflexão sobre significado, com 10 itens (5 de clareza de significado e 5 de exploração de propósito), escala de 1–7. Cada dimensão varia entre 5 e 35. **Não é o MLQ validado, não substitui diagnóstico psicológico e não reivindica normas clínicas**.

## Referencial
Steger, Frazier, Oishi e Kaler (2006), Journal of Counseling Psychology 53(1), 80–93. DOI 10.1037/0022-0167.53.1.80; Seligman (2011), Flourish, pilar Meaning do PERMA. **A publicação do MLQ original restringe uso comercial**.

## Página
https://impulsoflow.github.io/Missao/

A página estática implementa cadastro completo, dez reflexões, progresso, interpretação descritiva, plano de ação e PDF local com respostas e referências.

## Integração operacional pendente
Central: Impulsoflow/Central-Impulso. Não remover os oito cards existentes. Classificar MISSÃO em Desenvolvimento e registrar regra de acesso autenticada antes de ativar a política comercial.

Google Drive: pasta Relatorios_Missao_Impulso, ID 15xrzAJKRXvkfNeEVZEgvm3oKW03ISLdO. A pasta está provisionada; o envio automático não foi conectado.

Para envio real, configurar window.IMPULSO_MISSAO_API_URL no ambiente autorizado com serviço HTTPS confiável, que deve:
1. verificar autenticação, permissão de pesquisa, consentimento, limites e dez respostas;
2. calcular novamente as duas dimensões no servidor e usar submissionId como idempotency key;
3. salvar o mesmo PDF no Drive e registrar seu link na planilha/base;
4. enviar anexo ao participante e notificação ao administrador;
5. registrar status, falhas e tentativas, e retornar {ok:true,emailStatus:"sent",pdfUrl:"https://..."} somente depois das duas confirmações.

Não inserir credenciais de Google, API keys ou segredos em JavaScript público. Sem essa integração, o PDF é baixado no navegador e a página informa explicitamente que o envio e Drive não foram realizados.

## Testes
node tests/smoke.cjs

Antes de comercializar: homologar todos os passos com dados fictícios; testar envio real e conferência do arquivo Drive com autorização legítima; assegurar conformidade LGPD e proteger as respostas.
