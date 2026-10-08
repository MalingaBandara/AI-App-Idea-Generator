const form = document.getElementById("idea-form");
const promptInput = document.getElementById("customPrompt");
const charCount = document.getElementById("char-count");
const generateBtn = document.getElementById("generate-btn");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const resultCard = document.getElementById("result-card");
const resultBody = document.getElementById("result-body");
const copyBtn = document.getElementById("copy-btn");

let lastIdea = "";

function updateCount() {
    charCount.textContent = `${promptInput.value.length} / 800`;
}

promptInput.addEventListener("input", updateCount);
updateCount();

document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
        promptInput.value = chip.dataset.prompt;
        promptInput.focus();
        updateCount();
    });
});

function showEmpty() {
    emptyState.classList.remove("hidden");
    errorState.classList.add("hidden");
    resultCard.classList.add("hidden");
}

function showError(message) {
    emptyState.classList.add("hidden");
    resultCard.classList.add("hidden");
    errorState.classList.remove("hidden");
    errorMessage.textContent = message;
}

const SECTION_TITLES = [
    "app name",
    "one-line description",
    "one line description",
    "target audience",
    "core features",
    "unique value proposition",
    "uinque value proposition",
    "monetization strategy",
    "technology stack suggestions",
    "technology stack",
];

function stripMarks(value) {
    return value.replace(/\*\*/g, "").replace(/^#+\s*/, "").trim();
}

function isSectionTitle(line) {
    const cleaned = stripMarks(line)
        .replace(/^\d+\.\s*/, "")
        .replace(/:$/, "")
        .trim()
        .toLowerCase();

    return SECTION_TITLES.some((title) => cleaned === title || cleaned.startsWith(title));
}

function formatIdea(text) {
    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const lines = escaped.split("\n");
    const html = [];
    let inList = false;

    const closeList = () => {
        if (inList) {
            html.push("</ul>");
            inList = false;
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            continue;
        }

        if (isSectionTitle(trimmed)) {
            closeList();
            const title = stripMarks(trimmed).replace(/^\d+\.\s*/, "").replace(/:$/, "").trim();
            html.push(`<h3>${title}</h3>`);
            continue;
        }

        const dashBullet = trimmed.match(/^[-*]\s+(.+)$/);
        if (dashBullet) {
            if (!inList) {
                html.push("<ul>");
                inList = true;
            }
            html.push(`<li>${stripMarks(dashBullet[1])}</li>`);
            continue;
        }

        closeList();
        html.push(`<p>${stripMarks(trimmed)}</p>`);
    }

    closeList();
    return html.join("");
}

function showResult(idea) {
    lastIdea = idea;
    emptyState.classList.add("hidden");
    errorState.classList.add("hidden");
    resultCard.classList.remove("hidden");
    resultBody.innerHTML = formatIdea(idea);
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const customPrompt = promptInput.value.trim();

    if (!customPrompt) {
        showError("Custom prompt is required");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.classList.add("is-loading");
    showEmpty();

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customPrompt }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            showError(data.error || "An error occurred while generating the app idea.");
            return;
        }

        showResult(data.idea);
    } catch (error) {
        showError(error.message || "Could not reach the generator. Is the server running?");
    } finally {
        generateBtn.disabled = false;
        generateBtn.classList.remove("is-loading");
    }
});

copyBtn.addEventListener("click", async () => {
    if (!lastIdea) return;
    try {
        await navigator.clipboard.writeText(lastIdea);
        copyBtn.textContent = "Copied";
    } catch {
        copyBtn.textContent = "Copy failed";
    }
    setTimeout(() => {
        copyBtn.textContent = "Copy";
    }, 1600);
});
