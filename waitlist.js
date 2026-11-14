// Waitlist + event tracking for the content test. One Google Form collects everything:
// every page view, every Start click and every signup is one row (page, event, email, detail).
// Fill WAITLIST.url and the entry ids before publishing. Empty url = nothing is sent (local preview).
window.WAITLIST = {
  url: "https://docs.google.com/forms/d/e/1FAIpQLScp9oL_XQMj1lZ2mepcuu9iaHGQsoNH98pIOKDwQgDRHf2Lnw/formResponse",
  fields: { page: "entry.1419925646", event: "entry.895544516", email: "entry.693957186", detail: "entry.161928800" },
};

(function () {
  const page = document.body.dataset.page;
  const src = new URLSearchParams(location.search).get("src") || document.referrer.split("/")[2] || "direct";

  function send(event, email, detail) {
    const w = window.WAITLIST;
    if (!w.url) { console.info("[waitlist preview]", { page, event, email, detail, src }); return Promise.resolve(); }
    const body = new URLSearchParams();
    body.set(w.fields.page, page);
    body.set(w.fields.event, event);
    if (email) body.set(w.fields.email, email);
    body.set(w.fields.detail, [detail, "src=" + src].filter(Boolean).join(" | "));
    return fetch(w.url, { method: "POST", mode: "no-cors", body }).catch(() => {});
  }

  send("view");

  const start = document.getElementById("start");
  const form = document.getElementById("join");
  const done = document.getElementById("done");

  start.addEventListener("click", () => {
    send("start");
    start.hidden = true;
    form.hidden = false;
    form.querySelector("input[type=email]").focus();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const age = form.age;
    if (!form.reportValidity()) return;
    if (age && !age.checked) { age.focus(); return; }
    const picks = [...form.querySelectorAll("input[type=radio]:checked")].map((r) => r.name + "=" + r.value).join(" | ");
    form.querySelector("button[type=submit]").disabled = true;
    await send("signup", email, picks);
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
})();
