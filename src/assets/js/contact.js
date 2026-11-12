/* Inquiry form: validation, Web3Forms delivery, and a mailto fallback. */
(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submit = document.getElementById("submit-button");
  const modeNote = document.getElementById("form-mode");
  const accessKey = form.querySelector('[name="access_key"]');
  const configured = form.dataset.configured === "true" && Boolean(accessKey?.value);
  const email = form.dataset.email || "jacobmuniko53@gmail.com";
  const whatsapp = form.dataset.whatsapp || "254727380378";

  if (status) status.tabIndex = -1;

  if (!configured) {
    if (submit) submit.textContent = "Open email draft";
    if (modeNote) {
      modeNote.hidden = false;
      modeNote.textContent =
        "This opens your email app with the inquiry filled in. You can also email or use WhatsApp directly.";
    }
  } else if (submit) {
    submit.textContent = "Send inquiry";
  }

  /* Optional pre-selection: /contact/?service=web|ai|automation|custom */
  const params = new URLSearchParams(window.location.search);
  const serviceMap = {
    web: "Web application",
    ai: "AI tool",
    automation: "Workflow automation",
    custom: "Desktop software",
  };
  const requestedService = params.get("service");
  if (requestedService && serviceMap[requestedService]) {
    const select = form.elements.namedItem("project_type");
    if (select) select.value = serviceMap[requestedService];
  }

  const fields = {
    name: form.elements.namedItem("name"),
    email: form.elements.namedItem("email"),
    project_type: form.elements.namedItem("project_type"),
    message: form.elements.namedItem("message"),
    consent: form.elements.namedItem("consent"),
  };

  const errorFor = (name) => {
    const map = {
      name: "name-error",
      email: "email-error",
      project_type: "project-type-error",
      message: "message-error",
      consent: "consent-error",
    };
    return document.getElementById(map[name]);
  };

  const setError = (name, message) => {
    const field = fields[name];
    const error = errorFor(name);
    if (error) error.textContent = message;
    if (field && name !== "consent") field.setAttribute("aria-invalid", "true");
  };

  const clearError = (name) => {
    const field = fields[name];
    const error = errorFor(name);
    if (error) error.textContent = "";
    if (field && name !== "consent") field.removeAttribute("aria-invalid");
  };

  const clearAllErrors = () => {
    Object.keys(fields).forEach(clearError);
  };

  const showStatus = (message, type) => {
    if (!status) return;
    status.className = `form-status is-visible is-${type}`;
    status.textContent = message;
    status.focus({ preventScroll: false });
  };

  const showError = (message) => {
    if (!status) return;
    status.className = "form-status is-visible is-error";
    status.replaceChildren(document.createTextNode(`${message} `));

    const mail = document.createElement("a");
    mail.href = `mailto:${email}`;
    mail.textContent = "Email";
    mail.style.color = "inherit";

    const wa = document.createElement("a");
    wa.href = `https://wa.me/${whatsapp}`;
    wa.rel = "noopener";
    wa.textContent = "WhatsApp";
    wa.style.color = "inherit";

    status.append(mail, document.createTextNode(" or "), wa, document.createTextNode(" instead."));
    status.focus({ preventScroll: false });
  };

  form.addEventListener("input", (event) => {
    const name = event.target?.name;
    if (name && name in fields) clearError(name);
  });

  form.addEventListener("change", (event) => {
    const name = event.target?.name;
    if (name && name in fields) clearError(name);
  });

  const validate = () => {
    clearAllErrors();
    let firstInvalid = null;

    const mark = (name, message) => {
      setError(name, message);
      if (!firstInvalid) firstInvalid = fields[name];
    };

    if (!(fields.name?.value || "").trim()) {
      mark("name", "Please add your name.");
    }

    const emailValue = (fields.email?.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
      mark("email", "Please add an email address I can reply to.");
    }

    if (!(fields.project_type?.value || "").trim()) {
      mark("project_type", "Choose the kind of project this is closest to.");
    }

    if ((fields.message?.value || "").trim().length < 20) {
      mark("message", "Please add at least 20 characters about the problem.");
    }

    if (!fields.consent?.checked) {
      mark("consent", "Please confirm that I can reply to this inquiry.");
    }

    return { valid: !firstInvalid, firstInvalid };
  };

  const collect = () => {
    const type = fields.project_type?.value || "Project";
    const name = (fields.name?.value || "").trim();
    return {
      name,
      email: (fields.email?.value || "").trim(),
      project_type: type,
      budget: (form.elements.namedItem("budget")?.value || "").trim(),
      timeline: (form.elements.namedItem("timeline")?.value || "").trim(),
      message: (fields.message?.value || "").trim(),
      consent: fields.consent?.checked ? "yes" : "no",
      subject: `Project inquiry: ${type} from ${name}`,
      from_name: "Jacob Muniko portfolio",
    };
  };

  const openEmailDraft = (payload) => {
    const lines = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Project type: ${payload.project_type}`,
      payload.budget ? `Budget: ${payload.budget}` : "",
      payload.timeline ? `Timeline: ${payload.timeline}` : "",
      "",
      payload.message,
      "",
      "Sent from the portfolio contact form.",
    ].filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""));

    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      payload.subject
    )}&body=${encodeURIComponent(lines.join("\n"))}`;

    showStatus(
      "Your email app should open with the inquiry filled in. If it does not, email me directly.",
      "success"
    );
    window.location.href = mailto;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    /* Bots fill the hidden field. People do not. */
    const company = form.querySelector('[name="company"]');
    const botcheck = form.querySelector('[name="botcheck"]');
    if ((company?.value || "").trim() || botcheck?.checked) return;

    const { valid, firstInvalid } = validate();
    if (!valid) {
      firstInvalid?.focus();
      return;
    }

    const payload = collect();

    if (!configured) {
      openEmailDraft(payload);
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Sending...";
    }
    if (status) {
      status.className = "form-status";
      status.textContent = "";
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...payload, access_key: accessKey.value }),
        signal: controller.signal,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "The form service did not accept the message.");
      }

      form.reset();
      clearAllErrors();
      if (modeNote) modeNote.hidden = true;
      showStatus(
        "Thank you. Your inquiry was sent. I read every message myself and will reply by email.",
        "success"
      );
    } catch (error) {
      const reason =
        error?.name === "AbortError"
          ? "The request timed out."
          : "The form could not send.";
      showError(`Your message is still in the form. ${reason}`);
    } finally {
      window.clearTimeout(timer);
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Send inquiry";
      }
    }
  });
})();
