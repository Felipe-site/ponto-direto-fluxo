document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector(".paginator");  // ou use .object-tools se preferir outro lugar
  const form = document.getElementById("changelist-form");

  if (footer && form) {
    const btn = document.createElement("button");
    btn.innerText = "🗑 Excluir selecionados";
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #c53030;
      color: white;
      border: none;
      padding: 10px 16px;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      z-index: 1000;
    `;

    btn.onclick = function () {
      const actionInput = form.querySelector("select[name='action']");
      if (actionInput) {
        actionInput.value = "delete_selected";
        form.submit();
      }
    };

    document.body.appendChild(btn);
  }
});
