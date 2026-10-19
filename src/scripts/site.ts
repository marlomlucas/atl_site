const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
const mainNav = document.querySelector<HTMLElement>("#main-nav");

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Abrir menu");
  mainNav?.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  mainNav?.classList.toggle("is-open", !isOpen);
});
mainNav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (
    event.target instanceof Node &&
    !mainNav?.contains(event.target) &&
    !menuButton?.contains(event.target)
  )
    closeMenu();
});
matchMedia("(min-width: 861px)").addEventListener("change", closeMenu);

const projectDialog =
  document.querySelector<HTMLDialogElement>("#project-dialog");
let dialogOpener: HTMLButtonElement | null = null;
document
  .querySelectorAll<HTMLButtonElement>(".brief-open")
  .forEach((button) => {
    button.addEventListener("click", () => {
      dialogOpener = button;
      projectDialog?.showModal();
      document.body.classList.add("dialog-open");
    });
  });
document
  .querySelector(".dialog-close")
  ?.addEventListener("click", () => projectDialog?.close());
projectDialog?.addEventListener("click", (event) => {
  if (event.target === projectDialog) {
    const box = projectDialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      projectDialog.close();
  }
});
projectDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  dialogOpener?.focus();
});

document
  .querySelector<HTMLFormElement>("#project-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get("project") ?? "").trim();
    const challenge = String(data.get("challenge") ?? "").trim();
    const status = document.querySelector<HTMLElement>("#form-status");
    if (!name || !challenge) {
      if (status)
        status.textContent =
          "Preencha o nome do projeto e o desafio com uma breve descrição.";
      return;
    }
    const summary = [
      "ATL — Resumo do projeto",
      "",
      `Projeto: ${name}`,
      `Solução: ${String(data.get("type"))}`,
      "",
      "O desafio:",
      challenge,
      "",
      "Próxima conversa:",
      "• Quem vai usar a solução?",
      "• O que é prioridade para a primeira versão?",
      "• Existem sistemas ou ferramentas que precisam ser integrados?",
      "• Há alguma expectativa de prazo ou investimento?",
      "",
      "Este resumo foi preparado no site da ATL. Nenhuma informação foi enviada automaticamente.",
    ].join("\n");
    const fileUrl = URL.createObjectURL(
      new Blob(["\uFEFF" + summary], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "atl-resumo-do-projeto.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    if (status)
      status.textContent =
        "Resumo preparado! Guarde o arquivo para compartilhar na nossa primeira conversa. Nenhuma informação foi enviada.";
  });
