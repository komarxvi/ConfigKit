const generateButton = document.getElementById("generate-button");
const footnoteInput = document.getElementById("footnote-input");

function getUUID() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateProfileXML(footnoteText) {
  const profileUUID = getUUID();
  const payloadUUID = getUUID();

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>ConfigKit Lock Screen</string>
    <key>PayloadDescription</key>
    <string>Sets a custom footnote message on the Lock Screen.</string>
    <key>PayloadOrganization</key>
    <string>ConfigKit</string>
    <key>PayloadIdentifier</key>
    <string>com.configkit.profile</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${profileUUID}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDisplayName</key>
            <string>Lock Screen Message</string>
            <key>PayloadDescription</key>
            <string>Configures LockScreenFootnote</string>
            <key>PayloadType</key>
            <string>com.apple.shareddeviceconfiguration</string>
            <key>PayloadIdentifier</key>
            <string>com.configkit.lockscreen</string>
            <key>PayloadUUID</key>
            <string>${payloadUUID}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>LockScreenFootnote</key>
            <string>${footnoteText}</string>
        </dict>
    </array>
</dict>
</plist>`;
}

enerateButton.addEventListener("click", () => {
  const message = footnoteInput.value.trim();

  if (!message) {
    alert("Пожалуйста, введите текст!");
    return;
  }

 const xmlContent = generateProfileXML(message);
  const blob = new Blob([xmlContent], { type: "application/x-apple-aspen-config" });
  const downloadUrl = URL.createObjectURL(blob);

 window.location.href = downloadUrl;
});
