// 1. Находим элементы на странице
const generateButton = document.getElementById("generate-button");
const footnoteInput = document.getElementById("footnote-input");

// Безопасный генератор UUID
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

// 2. Сборка валидного XML-профиля Apple
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

// 3. Обработка клика
generateButton.addEventListener("click", () => {
  const message = footnoteInput.value.trim();

  if (!message) {
    alert("Пожалуйста, введите текст!");
    return;
  }

  const xmlContent = generateProfileXML(message);
  const blob = new Blob([xmlContent], { type: "application/x-apple-aspen-config" });
  const downloadUrl = URL.createObjectURL(blob);

  // Создаём виртуальную ссылку с атрибутом download для Safari
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "ConfigKit.mobileconfig";
  document.body.appendChild(link);
  
  link.click();

  // Удаляем ссылку и освобождаем память с небольшой задержкой, чтобы Safari успел подхватить файл
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }, 1500);
});
