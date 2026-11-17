const footnoteInput = document.getElementById("footnote-input");
const charCount = document.getElementById("char-count");
const xmlPreview = document.getElementById("xml-preview");
const phoneFootnote = document.getElementById("phone-footnote");
const generateButton = document.getElementById("generate-button");
const copyButton = document.getElementById("copy-button");

const restrictToggles = {
  allowCamera: document.getElementById("toggle-camera"),
  allowAssistant: document.getElementById("toggle-siri"),
  allowScreenShot: document.getElementById("toggle-screenshot"),
  allowAirDrop: document.getElementById("toggle-airdrop"),
  allowAppRemoval: document.getElementById("toggle-app-removal"),
  allowSafari: document.getElementById("toggle-safari")
};

const restrictionsCard = document.getElementById("restrictions-card");
const restrictionsToggle = document.getElementById("restrictions-toggle");
const restrictionsInner = document.querySelector(".disclosure-inner");

function syncRestrictionsHeight() {
  restrictionsCard.style.setProperty("--content-height", `${restrictionsInner.scrollHeight}px`);
}

function updateRestrictionIndicator() {
  const anyEnabled = Object.values(restrictToggles).some(function(toggle) {
    return toggle.checked;
  });
  restrictionsCard.classList.toggle("has-restrictions", anyEnabled);
}

syncRestrictionsHeight();
updateRestrictionIndicator();
if (window.ResizeObserver) {
  new ResizeObserver(syncRestrictionsHeight).observe(restrictionsInner);
}
window.addEventListener("resize", syncRestrictionsHeight);

restrictionsToggle.addEventListener("click", function() {
  const isOpen = restrictionsCard.classList.toggle("is-open");
  restrictionsToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) syncRestrictionsHeight();
});

function makeUUID() {
  if (window.crypto && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().toUpperCase();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.floor(Math.random() * 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  }).toUpperCase();
}

const profileUUIDs = {
  profile: makeUUID(),
  lockscreen: makeUUID(),
  restrictions: makeUUID()
};

function escapeXML(value) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateXML() {
  const userText = escapeXML(footnoteInput.value.trim() || "Swipe Up to Unlock");

  const restrictionKeys = Object.keys(restrictToggles).map(function(key) {
    const allowed = !restrictToggles[key].checked;
    return `            <key>${key}</key>\n            <${allowed}/>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>ConfigKit Profile</string>
    <key>PayloadIdentifier</key>
    <string>com.configkit.profile</string>
    <key>PayloadUUID</key>
    <string>${profileUUIDs.profile}</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDisplayName</key>
            <string>Lock Screen Message</string>
            <key>PayloadIdentifier</key>
            <string>com.configkit.lockscreen.footnote</string>
            <key>PayloadUUID</key>
            <string>${profileUUIDs.lockscreen}</string>
            <key>PayloadType</key>
            <string>com.apple.shareddeviceconfiguration</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>LockScreenFootnote</key>
            <string>${userText}</string>
        </dict>
        <dict>
            <key>PayloadDisplayName</key>
            <string>System Restrictions</string>
            <key>PayloadIdentifier</key>
            <string>com.configkit.restrictions.access</string>
            <key>PayloadUUID</key>
            <string>${profileUUIDs.restrictions}</string>
            <key>PayloadType</key>
            <string>com.apple.applicationaccess</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
${restrictionKeys}
        </dict>
    </array>
</dict>
</plist>`;
}

function updatePreview() {
  const message = footnoteInput.value.trim() || "Swipe Up to Unlock";
  xmlPreview.textContent = generateXML();
  charCount.textContent = `${footnoteInput.value.length} / ${footnoteInput.maxLength}`;
  phoneFootnote.textContent = message;
}

footnoteInput.addEventListener("input", updatePreview);
Object.values(restrictToggles).forEach(function(toggle) {
  toggle.addEventListener("change", function() {
    updatePreview();
    updateRestrictionIndicator();
  });
});

updatePreview();

function downloadProfile() {
  const blob = new Blob([generateXML()], { type: "application/x-apple-aspen-config" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ConfigKit.mobileconfig";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

generateButton.addEventListener("click", function() {
  if (generateButton.disabled) return;

  generateButton.disabled = true;
  generateButton.classList.add("is-generating");
  generateButton.textContent = "Generating...";

  setTimeout(function() {
    downloadProfile();

    generateButton.classList.remove("is-generating");
    generateButton.classList.add("is-success");
    generateButton.textContent = "Generated";

    setTimeout(function() {
      generateButton.classList.remove("is-success");
      generateButton.textContent = "Generate .mobileconfig";
      generateButton.disabled = false;
    }, 1000);
  }, 500);
});

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function(resolve, reject) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.cssText = "position:fixed;top:-1000px;left:-1000px;opacity:0";
    document.body.appendChild(helper);
    helper.select();

    try {
      const ok = document.execCommand("copy");
      ok ? resolve() : reject(new Error("Copy failed"));
    } catch (error) {
      reject(error);
    } finally {
      helper.remove();
    }
  });
}

function selectPreviewText() {
  const range = document.createRange();
  range.selectNodeContents(xmlPreview);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

copyButton.addEventListener("click", function() {
  copyText(xmlPreview.textContent).then(function() {
    copyButton.classList.add("is-success");
    copyButton.textContent = "✓ Copied";
  }).catch(function() {
    selectPreviewText();
    copyButton.textContent = "Press ⌘/Ctrl + C";
  }).finally(function() {
    setTimeout(function() {
      copyButton.classList.remove("is-success");
      copyButton.textContent = "Copy XML";
    }, 1600);
  });
});
